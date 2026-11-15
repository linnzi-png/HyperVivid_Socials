import type { NetworkId } from "./types";

/**
 * Why a network call failed, in terms the scheduler can act on.
 * Adapters map every network error to one of these; nothing else escapes an adapter.
 */
export type PublisherErrorCode =
  | "auth_expired" // tokens invalid or revoked: ask the user to reconnect
  | "permission_missing" // a scope was not granted or the app lacks approval
  | "rate_limited" // too many calls or posts: retry after retryAfterMs
  | "validation_failed" // the network rejected the post's content or settings
  | "media_rejected" // the file's format, size or length is not accepted
  | "duplicate" // the network says this exact post already exists
  | "network_unavailable" // timeouts, 5xx: safe to retry
  | "unknown";

const RETRYABLE: ReadonlySet<PublisherErrorCode> = new Set(["rate_limited", "network_unavailable"]);

export interface PublisherErrorInit {
  readonly network: NetworkId;
  readonly code: PublisherErrorCode;
  readonly message: string;
  /** Wait at least this long before retrying, when the network says so. */
  readonly retryAfterMs?: number;
  /** The network's own error code, kept for logs and support. */
  readonly remoteCode?: string;
  readonly cause?: unknown;
}

export class PublisherError extends Error {
  readonly network: NetworkId;
  readonly code: PublisherErrorCode;
  readonly retryable: boolean;
  readonly retryAfterMs: number | undefined;
  readonly remoteCode: string | undefined;

  constructor(init: PublisherErrorInit) {
    super(init.message, init.cause === undefined ? undefined : { cause: init.cause });
    this.name = "PublisherError";
    this.network = init.network;
    this.code = init.code;
    this.retryable = RETRYABLE.has(init.code);
    this.retryAfterMs = init.retryAfterMs;
    this.remoteCode = init.remoteCode;
  }

  /** True when the user must act (reconnect, grant a permission) before a retry can work. */
  get needsUserAction(): boolean {
    return this.code === "auth_expired" || this.code === "permission_missing";
  }
}

export function isPublisherError(value: unknown): value is PublisherError {
  return value instanceof PublisherError;
}
