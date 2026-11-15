/**
 * The contract every social network adapter implements.
 *
 * The scheduler, the web app and the mobile app talk only to this interface,
 * never to a network's API directly. That keeps network quirks inside one
 * adapter, and lets us swap an adapter (for example, to a paid aggregator for
 * a network whose app review stalls) without touching callers.
 *
 * Adapters run on the server only (a Supabase Edge Function, Deno), so they use
 * fetch and web-standard APIs only, never Node built-ins. Tokens never reach the
 * browser or phone.
 */

import type { SocialNetwork } from "@hypervivid/core";

/** Networks come from @hypervivid/core so the database, UI and adapters share one list. */
export type NetworkId = SocialNetwork;

/** What kind of account a post is published to. */
export type AccountKind =
  | "personal" // a person's own profile (TikTok user, LinkedIn member)
  | "channel" // a YouTube channel
  | "business" // an Instagram professional account
  | "page" // a Facebook Page
  | "organization"; // a LinkedIn company page

/** The shape of post a network supports. */
export type PostFormat =
  | "text"
  | "image"
  | "carousel" // several images or videos in one post
  | "video"
  | "short_video" // YouTube Shorts, Instagram Reels, TikTok video
  | "story"
  | "link";

export type Visibility = "public" | "followers" | "private" | "unlisted";

/** Limits and features of one network. Validation reads these; the UI shows them. */
export interface NetworkCapabilities {
  readonly network: NetworkId;
  readonly displayName: string;
  readonly accountKinds: readonly AccountKind[];
  readonly formats: readonly PostFormat[];
  readonly visibilities: readonly Visibility[];
  /** Max caption/description length in characters, counted as the network counts them. */
  readonly maxCaptionLength: number;
  /** Max title length, for networks that have a separate title (YouTube). */
  readonly maxTitleLength?: number;
  readonly requiresTitle: boolean;
  /** Most media items allowed in one post (1 for single-media networks). */
  readonly maxMediaItems: number;
  /** True when a post needs at least one image or video (no text-only posts). */
  readonly requiresMedia: boolean;
  /** True when the network can schedule natively; we still schedule on our side by default. */
  readonly supportsNativeScheduling: boolean;
  /** True when publishing finishes asynchronously and must be polled with getPublishStatus. */
  readonly asyncPublishing: boolean;
}

/** OAuth tokens for one connected account, held encrypted at rest by the backend. */
export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken?: string;
  /** When the access token expires, or undefined if the network gives no expiry. */
  readonly expiresAt?: Date;
  readonly refreshExpiresAt?: Date;
  /** Scopes the user actually granted, which can be fewer than we asked for. */
  readonly scopes: readonly string[];
}

/** A social account the user connected, as the adapter reports it. */
export interface ConnectedAccount {
  readonly network: NetworkId;
  readonly kind: AccountKind;
  /** The network's own id for this account, page, channel or organization. */
  readonly remoteId: string;
  readonly displayName: string;
  readonly handle?: string;
  readonly avatarUrl?: string;
}

export interface AuthorizationRequest {
  readonly redirectUri: string;
  /** Opaque CSRF state, checked by the backend on callback. */
  readonly state: string;
  /** PKCE code challenge (S256), for networks that support or require PKCE. */
  readonly codeChallenge?: string;
}

export interface CodeExchangeRequest {
  readonly code: string;
  readonly redirectUri: string;
  readonly codeVerifier?: string;
}

/** A media file already stored by us, which the adapter uploads or links to. */
export interface MediaAsset {
  readonly id: string;
  readonly kind: "image" | "video";
  readonly mimeType: string;
  readonly sizeBytes: number;
  /** A short-lived signed URL the adapter (or the network) can fetch the file from. */
  readonly url: string;
  readonly width?: number;
  readonly height?: number;
  readonly durationSeconds?: number;
  readonly altText?: string;
}

/** A post ready to publish to one account. The scheduler builds one per account. */
export interface PublishRequest {
  readonly account: ConnectedAccount;
  readonly format: PostFormat;
  readonly caption: string;
  readonly title?: string;
  readonly media: readonly MediaAsset[];
  readonly visibility: Visibility;
  readonly link?: string;
  /**
   * Stable key for this publish attempt (one per scheduled post per account).
   * Adapters must use it so a retry after a timeout never posts twice.
   */
  readonly idempotencyKey: string;
  /** Network-specific options, validated by the adapter (e.g. TikTok's disclosure flags). */
  readonly options?: Readonly<Record<string, unknown>>;
}

export type PublishResult =
  | {
      readonly status: "published";
      readonly remotePostId: string;
      readonly url?: string;
      readonly publishedAt: Date;
    }
  | {
      /** The network accepted the post and is still processing it; poll getPublishStatus. */
      readonly status: "processing";
      readonly remotePublishId: string;
      readonly checkAfterMs: number;
    };

export interface PostMetrics {
  readonly remotePostId: string;
  readonly fetchedAt: Date;
  readonly views?: number;
  readonly likes?: number;
  readonly comments?: number;
  readonly shares?: number;
  readonly saves?: number;
  readonly reach?: number;
}

export interface AccountMetrics {
  readonly remoteAccountId: string;
  readonly fetchedAt: Date;
  readonly followers?: number;
}

/** Everything an adapter call needs about who it is acting for. */
export interface AdapterContext {
  readonly tokens: AuthTokens;
  /** Used to cancel long uploads when a job times out. */
  readonly signal?: AbortSignal;
}

export interface PublisherAdapter {
  readonly network: NetworkId;
  readonly capabilities: NetworkCapabilities;
  /** OAuth scopes this adapter asks for. Kept in one place so app review and code agree. */
  readonly scopes: readonly string[];

  // Connecting an account
  getAuthorizationUrl(request: AuthorizationRequest): URL;
  exchangeCode(request: CodeExchangeRequest): Promise<AuthTokens>;
  refreshTokens(tokens: AuthTokens): Promise<AuthTokens>;
  /** Accounts the tokens can post to: the user, plus any pages, channels or organizations. */
  listAccounts(context: AdapterContext): Promise<readonly ConnectedAccount[]>;
  revoke?(tokens: AuthTokens): Promise<void>;

  // Publishing
  /** Network-specific checks on top of the shared validatePost. Pure and synchronous. */
  validate?(request: PublishRequest): readonly ValidationIssue[];
  publish(context: AdapterContext, request: PublishRequest): Promise<PublishResult>;
  getPublishStatus(context: AdapterContext, remotePublishId: string): Promise<PublishResult>;

  // Stats
  fetchPostMetrics(context: AdapterContext, remotePostIds: readonly string[]): Promise<readonly PostMetrics[]>;
  fetchAccountMetrics(context: AdapterContext, account: ConnectedAccount): Promise<AccountMetrics>;
}

export type ValidationCode =
  | "unsupported_format"
  | "unsupported_account_kind"
  | "unsupported_visibility"
  | "caption_too_long"
  | "title_missing"
  | "title_too_long"
  | "media_missing"
  | "too_many_media"
  | "media_kind_mismatch"
  | "invalid_option";

export interface ValidationIssue {
  readonly code: ValidationCode;
  readonly message: string;
  readonly field?: "caption" | "title" | "media" | "format" | "visibility" | "account" | "options";
}
