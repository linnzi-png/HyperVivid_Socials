/**
 * What Amplivid asks each social network for, and why. The privacy policy
 * renders this table, and each network's app review checks that the policy
 * names every permission requested on its consent screen. Add a scope here
 * before the app starts requesting it.
 */
export type NetworkId = "tiktok" | "youtube" | "instagram" | "facebook" | "linkedin";

export interface NetworkDataUse {
  id: NetworkId;
  name: string;
  /** The network's own API product we connect through. */
  via: string;
  /** Permission names exactly as shown in the network's developer console. */
  scopes: readonly string[];
  /** Plain-language list of the data we receive. */
  data: readonly string[];
  /** Plain-language list of what we use it for. */
  uses: readonly string[];
  /** Where the user can revoke Amplivid's access on the network's side. */
  revokeUrl: string;
  revokeLabel: string;
  /** The network's own privacy policy. */
  privacyUrl: string;
}

export const networkDataUses: readonly NetworkDataUse[] = [
  {
    id: "tiktok",
    name: "TikTok",
    via: "TikTok Login Kit and Content Posting API",
    scopes: ["user.info.basic", "user.info.stats", "video.upload", "video.publish", "video.list"],
    data: [
      "Your TikTok account ID (open ID), display name and profile picture",
      "Follower, following and like counts for your account",
      "The list of your public videos and their view, like, comment and share counts",
    ],
    uses: [
      "Show which TikTok account is connected",
      "Upload and publish the videos you choose, with the caption and settings you choose",
      "Show how your posts perform in your Amplivid stats",
    ],
    revokeUrl: "https://www.tiktok.com/setting",
    revokeLabel: "TikTok app: Settings and privacy, Security and permissions, Manage app permissions",
    privacyUrl: "https://www.tiktok.com/legal/page/us/privacy-policy/en",
  },
  {
    id: "youtube",
    name: "YouTube",
    via: "YouTube Data API and YouTube Analytics API (YouTube API Services)",
    scopes: [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/yt-analytics.readonly",
    ],
    data: [
      "Your YouTube channel ID, channel name and profile image",
      "Your channel's videos and their titles, thumbnails and privacy status",
      "View, watch-time, like, comment and subscriber statistics for your channel and videos",
    ],
    uses: [
      "Show which YouTube channel is connected",
      "Upload the videos and Shorts you choose, with the title, description, thumbnail and privacy setting you choose",
      "Show how your videos perform in your Amplivid stats",
    ],
    revokeUrl: "https://security.google.com/settings/security/permissions",
    revokeLabel: "Google security settings: Third-party apps with account access",
    privacyUrl: "https://policies.google.com/privacy",
  },
  {
    id: "instagram",
    name: "Instagram",
    via: "Instagram API with Instagram Login (Meta)",
    scopes: [
      "instagram_business_basic",
      "instagram_business_content_publish",
      "instagram_business_manage_insights",
    ],
    data: [
      "Your Instagram professional account ID, username and profile picture",
      "Your media and their captions, likes and comments counts",
      "Reach, views and engagement insights for your account and posts",
    ],
    uses: [
      "Show which Instagram account is connected",
      "Publish the photos, carousels and Reels you choose, with the caption you choose",
      "Show how your posts perform in your Amplivid stats",
    ],
    revokeUrl: "https://www.instagram.com/accounts/manage_access/",
    revokeLabel: "Instagram: Settings, Website permissions, Apps and websites",
    privacyUrl: "https://privacycenter.instagram.com/policy",
  },
  {
    id: "facebook",
    name: "Facebook",
    via: "Facebook Login for Business and the Pages API (Meta)",
    scopes: ["pages_show_list", "pages_read_engagement", "pages_manage_posts", "read_insights"],
    data: [
      "Your name and Facebook user ID, and the list of Pages you manage",
      "Basic information about the Pages you pick (name, ID, profile picture)",
      "Engagement and insights for the posts on those Pages",
    ],
    uses: [
      "Let you pick which Facebook Pages to connect",
      "Publish the posts, photos and videos you choose to those Pages",
      "Show how your Page posts perform in your Amplivid stats",
    ],
    revokeUrl: "https://www.facebook.com/settings?tab=business_tools",
    revokeLabel: "Facebook: Settings and privacy, Settings, Business integrations",
    privacyUrl: "https://www.facebook.com/privacy/policy/",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    via: "Sign In with LinkedIn using OpenID Connect and Share on LinkedIn",
    scopes: ["openid", "profile", "email", "w_member_social"],
    data: [
      "Your LinkedIn member ID, name, profile picture and email address",
    ],
    uses: [
      "Show which LinkedIn profile is connected",
      "Publish the posts, images and videos you choose to your LinkedIn profile",
    ],
    revokeUrl: "https://www.linkedin.com/mypreferences/d/data-sharing-for-permitted-services",
    revokeLabel: "LinkedIn: Settings, Data privacy, Permitted services",
    privacyUrl: "https://www.linkedin.com/legal/privacy-policy",
  },
];

/** Required verbatim by Google's API Services User Data Policy. */
export const googleLimitedUseStatement =
  "Amplivid's use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.";

export const googleUserDataPolicyUrl =
  "https://developers.google.com/terms/api-services-user-data-policy";
export const youtubeTermsUrl = "https://www.youtube.com/t/terms";
export const googlePrivacyUrl = "https://www.google.com/policies/privacy";
