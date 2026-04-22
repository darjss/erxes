import { sendTRPCMessage } from 'erxes-api-shared/utils';

/**
 * Resolve client portal users linked to an erxes customer id (or cp user id).
 * Mirrors booking cancellation lookup so membership and booking behave consistently.
 */
export async function findCpUsersByCustomerId(
  subdomain: string,
  customerId: string,
): Promise<Array<{ cpUserId: string; clientPortalId: string }>> {
  const listResult = await sendTRPCMessage({
    subdomain,
    pluginName: 'core',
    method: 'query',
    module: 'cpUsers',
    action: 'list',
    input: {
      erxesCustomerId: customerId,
      limit: 1000,
      skip: 0,
    },
    defaultValue: { list: [] as Array<any>, totalCount: 0 },
  });

  const fromList = Array.isArray(listResult?.list) ? listResult.list : [];

  if (fromList.length === 0) {
    const byErxesCustomerId = await sendTRPCMessage({
      subdomain,
      pluginName: 'core',
      method: 'query',
      module: 'cpUsers',
      action: 'get',
      input: {
        erxesCustomerId: customerId,
      },
      defaultValue: null,
    });

    if (byErxesCustomerId?._id && byErxesCustomerId?.clientPortalId) {
      return [
        {
          cpUserId: String(byErxesCustomerId._id),
          clientPortalId: String(byErxesCustomerId.clientPortalId),
        },
      ];
    }

    const byId = await sendTRPCMessage({
      subdomain,
      pluginName: 'core',
      method: 'query',
      module: 'cpUsers',
      action: 'get',
      input: {
        id: customerId,
      },
      defaultValue: null,
    });

    if (byId?._id && byId?.clientPortalId) {
      return [
        {
          cpUserId: String(byId._id),
          clientPortalId: String(byId.clientPortalId),
        },
      ];
    }

    return [];
  }

  const byId = new Map<string, string>();
  for (const cpUser of fromList) {
    if (!cpUser?._id || !cpUser?.clientPortalId) continue;
    byId.set(String(cpUser._id), String(cpUser.clientPortalId));
  }

  return Array.from(byId.entries()).map(([cpUserId, clientPortalId]) => ({
    cpUserId,
    clientPortalId,
  }));
}
