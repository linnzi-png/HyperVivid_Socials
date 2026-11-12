/** Social networks HyperVivid publishes to at launch, in rollout order. */
export const SOCIAL_NETWORKS = ["tiktok", "youtube", "instagram", "facebook", "linkedin"] as const;

export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];

export const NETWORK_LABELS: Record<SocialNetwork, string> = {
  tiktok: "TikTok",
  youtube: "YouTube",
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
};

export function isSocialNetwork(value: unknown): value is SocialNetwork {
  return typeof value === "string" && (SOCIAL_NETWORKS as readonly string[]).includes(value);
}
