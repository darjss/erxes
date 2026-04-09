import { httpBatchLink, createTRPCUntypedClient } from '@trpc/client';
import { getPlugin, isEnabled } from 'erxes-api-shared/utils';
import { encodeTRPCContextHeader } from 'erxes-api-shared/utils/trpc';

let cachedClient: ReturnType<typeof createTRPCUntypedClient> | null = null;

export const blockAgencyTRPCClient = async (): Promise<
  ReturnType<typeof createTRPCUntypedClient> | null
> => {
  if (cachedClient) return cachedClient;

  try {
    const enabled = await isEnabled('blockagency');
    if (!enabled) return null;

    const plugin = await getPlugin('blockagency');
    if (!plugin?.address) return null;

    const contextHeader = encodeTRPCContextHeader(
      'blockagency',
      'query',
      undefined,
    );

    cachedClient = createTRPCUntypedClient({
      links: [
        httpBatchLink({
          url: plugin.address + '/trpc',
          headers: () => ({ 'x-trpc-context': contextHeader }),
        }),
      ],
    });

    return cachedClient;
  } catch {
    return null;
  }
};
