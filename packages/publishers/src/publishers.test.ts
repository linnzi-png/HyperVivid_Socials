import { describe, expect, it } from "vitest";
import {
  CAPABILITIES,
  PublisherError,
  characterCount,
  createRegistry,
  isPublisherError,
  validatePost,
  type ConnectedAccount,
  type PublisherAdapter,
  type PublishRequest,
} from "./index";
import { SOCIAL_NETWORKS } from "@hypervivid/core";

const tiktokAccount: ConnectedAccount = { network: "tiktok", kind: "personal", remoteId: "u1", displayName: "Me" };
const video = { id: "m1", kind: "video", mimeType: "video/mp4", sizeBytes: 1000, url: "https://example.test/v.mp4" } as const;
const image = { id: "m2", kind: "image", mimeType: "image/jpeg", sizeBytes: 1000, url: "https://example.test/i.jpg" } as const;

function request(overrides: Partial<PublishRequest> = {}): PublishRequest {
  return {
    account: tiktokAccount,
    format: "short_video",
    caption: "Hello",
    media: [video],
    visibility: "public",
    idempotencyKey: "post-1:acct-1",
    ...overrides,
  };
}

function fakeAdapter(network: PublisherAdapter["network"], extra: Partial<PublisherAdapter> = {}): PublisherAdapter {
  const notUsed = () => {
    throw new Error("not used in tests");
  };
  return {
    network,
    capabilities: CAPABILITIES[network],
    scopes: [],
    getAuthorizationUrl: notUsed,
    exchangeCode: notUsed,
    refreshTokens: notUsed,
    listAccounts: notUsed,
    publish: notUsed,
    getPublishStatus: notUsed,
    fetchPostMetrics: notUsed,
    fetchAccountMetrics: notUsed,
    ...extra,
  };
}

describe("CAPABILITIES", () => {
  it("covers every network in core, each labelled with its own id", () => {
    for (const network of SOCIAL_NETWORKS) {
      expect(CAPABILITIES[network].network).toBe(network);
    }
  });
});

describe("characterCount", () => {
  it("counts emoji as one character", () => {
    expect(characterCount("hi 👋")).toBe(4);
  });
});

describe("validatePost", () => {
  it("accepts a valid TikTok video", () => {
    expect(validatePost(CAPABILITIES.tiktok, request())).toEqual([]);
  });

  it("reports every problem at once", () => {
    const issues = validatePost(
      CAPABILITIES.tiktok,
      request({ format: "text", caption: "x".repeat(2201), media: [], visibility: "unlisted" }),
    );
    expect(issues.map((i) => i.code).sort()).toEqual(
      ["caption_too_long", "media_missing", "unsupported_format", "unsupported_visibility"].sort(),
    );
  });

  it("requires a YouTube title and caps its length", () => {
    const account: ConnectedAccount = { network: "youtube", kind: "channel", remoteId: "c1", displayName: "Ch" };
    expect(validatePost(CAPABILITIES.youtube, request({ account, format: "video" })).map((i) => i.code)).toEqual([
      "title_missing",
    ]);
    expect(
      validatePost(CAPABILITIES.youtube, request({ account, format: "video", title: "t".repeat(101) })).map((i) => i.code),
    ).toEqual(["title_too_long"]);
  });

  it("allows text-only LinkedIn posts but not mismatched media", () => {
    const account: ConnectedAccount = { network: "linkedin", kind: "personal", remoteId: "p1", displayName: "Me" };
    expect(validatePost(CAPABILITIES.linkedin, request({ account, format: "text", media: [] }))).toEqual([]);
    expect(validatePost(CAPABILITIES.linkedin, request({ account, format: "video", media: [image] })).map((i) => i.code)).toEqual(
      ["media_kind_mismatch"],
    );
  });

  it("limits non-carousel posts to one media item and carousels to the network max", () => {
    const account: ConnectedAccount = { network: "instagram", kind: "business", remoteId: "b1", displayName: "Biz" };
    expect(validatePost(CAPABILITIES.instagram, request({ account, format: "image", media: [image, image] })).map((i) => i.code)).toEqual(
      ["too_many_media"],
    );
    expect(validatePost(CAPABILITIES.instagram, request({ account, format: "carousel", media: Array(11).fill(image) })).map((i) => i.code)).toEqual(
      ["too_many_media"],
    );
    expect(validatePost(CAPABILITIES.instagram, request({ account, format: "carousel", media: Array(10).fill(image) }))).toEqual([]);
  });

  it("rejects an account kind the network cannot post to", () => {
    const account: ConnectedAccount = { network: "facebook", kind: "personal", remoteId: "u", displayName: "Me" };
    expect(validatePost(CAPABILITIES.facebook, request({ account, format: "text", media: [] })).map((i) => i.code)).toEqual([
      "unsupported_account_kind",
    ]);
  });
});

describe("createRegistry", () => {
  it("looks adapters up by network", () => {
    const registry = createRegistry([fakeAdapter("tiktok"), fakeAdapter("youtube")]);
    expect(registry.get("tiktok").network).toBe("tiktok");
    expect(registry.has("linkedin")).toBe(false);
    expect(registry.networks()).toEqual(["tiktok", "youtube"]);
    expect(() => registry.get("linkedin")).toThrow(/No publisher adapter/);
  });

  it("refuses two adapters for one network, or mismatched capabilities", () => {
    expect(() => createRegistry([fakeAdapter("tiktok"), fakeAdapter("tiktok")])).toThrow(/Two adapters/);
    expect(() => createRegistry([fakeAdapter("tiktok", { capabilities: CAPABILITIES.youtube })])).toThrow(/declares/);
  });

  it("combines shared and adapter-specific validation", () => {
    const registry = createRegistry([
      fakeAdapter("tiktok", {
        validate: () => [{ code: "invalid_option", field: "options", message: "Pick a privacy level." }],
      }),
    ]);
    expect(registry.validate("tiktok", request({ caption: "x".repeat(3000) })).map((i) => i.code)).toEqual([
      "caption_too_long",
      "invalid_option",
    ]);
  });
});

describe("PublisherError", () => {
  it("marks rate limits and outages as retryable and auth problems as needing the user", () => {
    const limited = new PublisherError({ network: "instagram", code: "rate_limited", message: "slow down", retryAfterMs: 60_000 });
    expect(limited.retryable).toBe(true);
    expect(limited.needsUserAction).toBe(false);
    expect(limited.retryAfterMs).toBe(60_000);

    const expired = new PublisherError({ network: "youtube", code: "auth_expired", message: "reconnect" });
    expect(expired.retryable).toBe(false);
    expect(expired.needsUserAction).toBe(true);
    expect(isPublisherError(expired)).toBe(true);
    expect(isPublisherError(new Error("x"))).toBe(false);
  });
});
