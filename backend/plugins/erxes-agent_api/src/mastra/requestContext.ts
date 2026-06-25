import { AsyncLocalStorage } from 'async_hooks';

// Propagates auth headers through the entire async call chain.
// Any tool executed within runWithAuth() automatically inherits the context.

/** A destructive operation the user approved for this turn (op name + its args). */
export interface ApprovedOp {
  operation: string;
  args?: Record<string, unknown>;
}

interface RequestAuth {
  userHeader?: string;
  token?: string;
  /** Requesting user's id — used to resolve their own skills at request time. */
  userId?: string;
  /** Current chat thread + agent — used by the makeSkill tool to read this turn's thread. */
  threadId?: string;
  agentId?: string;
  /** Tenant of the request — required by tools that query tenant-partitioned stores (Qdrant). */
  subdomain?: string;
  /** Destructive ops the user approved for THIS turn — the execute guard runs an
   *  otherwise-gated delete/merge only when it matches one of these. */
  approvedOps?: ApprovedOp[];
}

const authStorage = new AsyncLocalStorage<RequestAuth>();

/** Run fn with the given auth visible to every async callee (tools, fetches). */
export function runWithAuth<T>(
  ctx: RequestAuth,
  fn: () => Promise<T>,
): Promise<T> {
  return authStorage.run(ctx, fn);
}

/** The auth context of the current async chain, when inside runWithAuth. */
export function getCurrentAuth(): RequestAuth | undefined {
  return authStorage.getStore();
}
