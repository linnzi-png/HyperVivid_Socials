import { validatePost } from "./validate";
import type { NetworkId, PublisherAdapter, PublishRequest, ValidationIssue } from "./types";

/** Looks up the adapter for a network. Built once at server start-up. */
export interface PublisherRegistry {
  get(network: NetworkId): PublisherAdapter;
  has(network: NetworkId): boolean;
  networks(): NetworkId[];
  /** Shared checks plus the adapter's own checks. */
  validate(network: NetworkId, request: PublishRequest): ValidationIssue[];
}

export function createRegistry(adapters: readonly PublisherAdapter[]): PublisherRegistry {
  const byNetwork = new Map<NetworkId, PublisherAdapter>();
  for (const adapter of adapters) {
    if (byNetwork.has(adapter.network)) {
      throw new Error(`Two adapters registered for ${adapter.network}.`);
    }
    if (adapter.capabilities.network !== adapter.network) {
      throw new Error(`Adapter for ${adapter.network} declares capabilities for ${adapter.capabilities.network}.`);
    }
    byNetwork.set(adapter.network, adapter);
  }

  const get = (network: NetworkId): PublisherAdapter => {
    const adapter = byNetwork.get(network);
    if (!adapter) throw new Error(`No publisher adapter registered for ${network}.`);
    return adapter;
  };

  return {
    get,
    has: (network) => byNetwork.has(network),
    networks: () => [...byNetwork.keys()],
    validate(network, request) {
      const adapter = get(network);
      return [...validatePost(adapter.capabilities, request), ...(adapter.validate?.(request) ?? [])];
    },
  };
}
