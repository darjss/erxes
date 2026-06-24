import { useQuery } from '@apollo/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GET_AGENT_RUNTIME_READY } from '../graphql/queries';

// How often to re-check the runtime while we're waiting for it to come back.
const POLL_MS = 3000;
// After triggering a restart/rekey the OLD gateway can still answer "ready" for
// a moment before it actually goes down. Ignore "ready" during this grace
// window so we don't hide the overlay only to drop the iframe onto a 503.
const GRACE_MS = 6000;
// Never trap the user under the overlay forever — if readiness never reports
// true (e.g. health endpoint shape changed), reveal the iframe after this.
const MAX_WAIT_MS = 3 * 60 * 1000;

/**
 * Gates the assistant iframe behind a server-side runtime-readiness probe.
 *
 * The iframe loads a cross-origin URL, so the browser cannot read its HTTP
 * status — a restarting gateway just renders the runtime's raw 503 page inside
 * the frame. Instead we poll a backend query that checks the runtime health
 * server-side, show the loading overlay until it's back, then call `onReady`
 * (which reloads the iframe).
 */
export type RuntimeWaitReason = 'starting' | 'restarting';

export const useRuntimeReadyGate = (
  identifierId: string | undefined,
  onReady?: () => void,
  enabled: boolean = true,
) => {
  const [waiting, setWaiting] = useState(false);
  const [reason, setReason] = useState<RuntimeWaitReason>('restarting');
  const graceUntilRef = useRef(0);
  const deadlineRef = useRef(0);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const { data, startPolling, stopPolling, refetch } = useQuery<{
    getAgentRuntimeReady: boolean | null;
  }>(GET_AGENT_RUNTIME_READY, {
    variables: { identifierId },
    skip: !identifierId || !enabled,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const ready = data?.getAgentRuntimeReady ?? null;

  const finish = useCallback(() => {
    setWaiting(false);
    stopPolling?.();
    onReadyRef.current?.();
  }, [stopPolling]);

  const beginWaiting = useCallback(
    (opts?: { grace?: boolean; reason?: RuntimeWaitReason }) => {
      const now = Date.now();
      graceUntilRef.current = opts?.grace === false ? 0 : now + GRACE_MS;
      deadlineRef.current = now + MAX_WAIT_MS;
      setReason(opts?.reason ?? 'restarting');
      setWaiting(true);
    },
    [],
  );

  useEffect(() => {
    if (!waiting) {
      stopPolling?.();
      return;
    }
    refetch?.();
    startPolling?.(POLL_MS);
    return () => stopPolling?.();
  }, [waiting, startPolling, stopPolling, refetch]);

  useEffect(() => {
    if (!waiting) return;
    if (Date.now() >= deadlineRef.current) {
      finish();
      return;
    }
    if (Date.now() < graceUntilRef.current) return;
    if (ready === true) {
      finish();
    }
  }, [waiting, ready, finish]);

  return { waiting, ready, reason, beginWaiting };
};
