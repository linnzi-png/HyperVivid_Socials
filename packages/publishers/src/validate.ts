import type { NetworkCapabilities, PostFormat, PublishRequest, ValidationIssue } from "./types";

/** Counts characters the way people see them (Unicode code points), not UTF-16 units. */
export function characterCount(text: string): number {
  return Array.from(text).length;
}

const VIDEO_FORMATS: ReadonlySet<PostFormat> = new Set(["video", "short_video"]);
const IMAGE_FORMATS: ReadonlySet<PostFormat> = new Set(["image"]);

/**
 * Checks a post against a network's shared limits. Returns every problem found,
 * so the composer can show them all at once. An empty array means valid.
 * Adapters add network-specific checks through their own validate().
 */
export function validatePost(capabilities: NetworkCapabilities, request: PublishRequest): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const name = capabilities.displayName;

  if (!capabilities.formats.includes(request.format)) {
    issues.push({ code: "unsupported_format", field: "format", message: `${name} does not support ${request.format} posts.` });
  }
  if (!capabilities.accountKinds.includes(request.account.kind)) {
    issues.push({
      code: "unsupported_account_kind",
      field: "account",
      message: `${name} cannot publish to a ${request.account.kind} account.`,
    });
  }
  if (!capabilities.visibilities.includes(request.visibility)) {
    issues.push({
      code: "unsupported_visibility",
      field: "visibility",
      message: `${name} does not support ${request.visibility} visibility.`,
    });
  }

  const captionLength = characterCount(request.caption);
  if (captionLength > capabilities.maxCaptionLength) {
    issues.push({
      code: "caption_too_long",
      field: "caption",
      message: `${name} allows ${capabilities.maxCaptionLength} characters; this caption has ${captionLength}.`,
    });
  }

  const title = request.title?.trim() ?? "";
  if (capabilities.requiresTitle && title.length === 0) {
    issues.push({ code: "title_missing", field: "title", message: `${name} needs a title.` });
  }
  if (capabilities.maxTitleLength !== undefined && characterCount(title) > capabilities.maxTitleLength) {
    issues.push({
      code: "title_too_long",
      field: "title",
      message: `${name} allows ${capabilities.maxTitleLength} characters in a title.`,
    });
  }

  const needsMedia = capabilities.requiresMedia || request.format !== "text" && request.format !== "link";
  if (needsMedia && request.media.length === 0) {
    issues.push({ code: "media_missing", field: "media", message: `${name} needs an image or video for this post.` });
  }
  const maxItems = request.format === "carousel" ? capabilities.maxMediaItems : 1;
  if (request.media.length > maxItems) {
    issues.push({
      code: "too_many_media",
      field: "media",
      message: `${name} allows ${maxItems} media item${maxItems === 1 ? "" : "s"} in a ${request.format} post.`,
    });
  }
  if (VIDEO_FORMATS.has(request.format) && request.media.some((m) => m.kind !== "video")) {
    issues.push({ code: "media_kind_mismatch", field: "media", message: `A ${request.format} post needs a video file.` });
  }
  if (IMAGE_FORMATS.has(request.format) && request.media.some((m) => m.kind !== "image")) {
    issues.push({ code: "media_kind_mismatch", field: "media", message: "An image post needs an image file." });
  }

  return issues;
}
