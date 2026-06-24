import { IModels } from '~/connectionResolvers';
import {
  getThreadTitle,
  getNativeMemory,
  ensureThreadRegistered,
} from '@/session/nativeStore';
import { IMastraChatAttachment } from '@/session/@types/session';
import { MemoryBinding, PreparedTurn } from '@/agent/types';

export async function persistTurn(params: {
  models: IModels;
  prepared: PreparedTurn;
  reply: string | null;
  assistantMessageId?: string;
}): Promise<{
  titlePromise: Promise<string | null>;
  assistantMessageId: string | null;
}> {
  const { prepared, reply, assistantMessageId } = params;
  const { useMemory, memCtx, agentConfig, attachments } = prepared;

  const titlePromise: Promise<string | null> =
    reply && prepared.memoryBinding
      ? getThreadTitle(
          memCtx.subdomain,
          prepared.memoryBinding.thread,
          prepared.memoryBinding.resource,
        ).catch(() => null)
      : Promise.resolve<string | null>(null);

  let nativeAssistantId = assistantMessageId ?? null;
  if (useMemory && prepared.memoryBinding) {
    try {
      nativeAssistantId = await patchNativeTurn({
        subdomain: memCtx.subdomain,
        binding: prepared.memoryBinding,
        agentId: agentConfig.agentId,
        reply,
        attachments,
        assistantMessageId,
      });
    } catch (e) {
      console.warn(
        `[native-chat-store] turn reconcile skipped: ${(e as Error)?.message || e}`,
      );
    }
  }

  return { titlePromise, assistantMessageId: nativeAssistantId };
}

interface NativeChatMessage {
  id: string;
  role: string;
  content?: { metadata?: Record<string, unknown> } & Record<string, unknown>;
}

function mergeErxesMeta(
  content: NativeChatMessage['content'],
  erxes: Record<string, unknown>,
): Record<string, unknown> {
  const base = (content ?? {}) as Record<string, unknown>;
  const metadata = (base.metadata ?? {}) as Record<string, unknown>;
  const prevErxes = (metadata.erxes ?? {}) as Record<string, unknown>;
  return {
    ...base,
    metadata: { ...metadata, erxes: { ...prevErxes, ...erxes } },
  };
}

export async function patchNativeTurn(params: {
  subdomain: string;
  binding: MemoryBinding;
  agentId: string;
  reply: string | null;
  attachments?: IMastraChatAttachment[];
  assistantMessageId?: string;
}): Promise<string | null> {
  const { subdomain, binding, agentId, reply, attachments } = params;
  const { assistantMessageId } = params;

  await ensureThreadRegistered(
    subdomain,
    binding.thread,
    binding.resource,
    agentId,
  );

  const wantUser = Boolean(attachments?.length);

  if (!wantUser && (assistantMessageId || !reply)) {
    return assistantMessageId ?? null;
  }

  const memory = await getNativeMemory(subdomain);
  const recalled = (await memory.recall({
    threadId: binding.thread,
    resourceId: binding.resource,
    perPage: 4,
    page: 0,
    orderBy: { field: 'createdAt', direction: 'DESC' },
  })) as { messages?: NativeChatMessage[] };
  const recent = recalled?.messages ?? [];

  if (wantUser) {
    const userMsg = recent.find((m) => m.role === 'user');
    if (userMsg) {
      await memory.updateMessages({
        messages: [
          {
            id: userMsg.id,
            content: mergeErxesMeta(userMsg.content, { attachments }),
          },
        ],
      });
    }
  }

  return (
    assistantMessageId ??
    (reply ? recent.find((m) => m.role === 'assistant')?.id ?? null : null)
  );
}
