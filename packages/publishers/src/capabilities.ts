import type { NetworkCapabilities, NetworkId } from "./types";

/**
 * Starting limits per network, from each network's API docs (Nov 2026).
 * Each adapter owns its own copy once built and re-checks these against the
 * live docs; these are the shared defaults the composer UI can show today.
 *
 * Sources:
 * - TikTok: https://developers.tiktok.com/doc/content-posting-api-reference-direct-post
 * - YouTube: https://developers.google.com/youtube/v3/docs/videos#snippet
 * - Instagram: https://developers.facebook.com/docs/instagram-platform/content-publishing
 * - Facebook Pages: https://developers.facebook.com/docs/pages-api/posts
 * - LinkedIn: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api
 */
export const CAPABILITIES: Readonly<Record<NetworkId, NetworkCapabilities>> = {
  tiktok: {
    network: "tiktok",
    displayName: "TikTok",
    accountKinds: ["personal"],
    formats: ["short_video", "carousel"],
    visibilities: ["public", "followers", "private"],
    maxCaptionLength: 2200,
    requiresTitle: false,
    maxMediaItems: 35,
    requiresMedia: true,
    supportsNativeScheduling: false,
    asyncPublishing: true,
  },
  youtube: {
    network: "youtube",
    displayName: "YouTube",
    accountKinds: ["channel"],
    formats: ["video", "short_video"],
    visibilities: ["public", "unlisted", "private"],
    maxCaptionLength: 5000,
    maxTitleLength: 100,
    requiresTitle: true,
    maxMediaItems: 1,
    requiresMedia: true,
    supportsNativeScheduling: true,
    asyncPublishing: true,
  },
  instagram: {
    network: "instagram",
    displayName: "Instagram",
    accountKinds: ["business"],
    formats: ["image", "carousel", "short_video", "story"],
    visibilities: ["public"],
    maxCaptionLength: 2200,
    requiresTitle: false,
    maxMediaItems: 10,
    requiresMedia: true,
    supportsNativeScheduling: false,
    asyncPublishing: true,
  },
  facebook: {
    network: "facebook",
    displayName: "Facebook",
    accountKinds: ["page"],
    formats: ["text", "link", "image", "carousel", "video", "short_video"],
    visibilities: ["public"],
    maxCaptionLength: 63206,
    requiresTitle: false,
    maxMediaItems: 10,
    requiresMedia: false,
    supportsNativeScheduling: true,
    asyncPublishing: true,
  },
  linkedin: {
    network: "linkedin",
    displayName: "LinkedIn",
    accountKinds: ["personal", "organization"],
    formats: ["text", "link", "image", "carousel", "video"],
    visibilities: ["public", "followers"],
    maxCaptionLength: 3000,
    requiresTitle: false,
    maxMediaItems: 20,
    requiresMedia: false,
    supportsNativeScheduling: false,
    asyncPublishing: true,
  },
};
