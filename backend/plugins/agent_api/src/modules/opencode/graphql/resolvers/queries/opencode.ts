import { IContext } from '~/connectionResolvers';
import {
  getOpencodeServerInfo,
  getOpencodeServerPassword,
  isOpencodeServerReady,
} from '~/modules/opencode/utils';
import { SERVER_STATUSES } from '~/modules/agent/constants';

export const opencodeQueries = {
  getOpencode: async (
    _root: undefined,
    { identifierId }: { identifierId: string },
    { models }: IContext,
  ) => {
    const opencode = await models.OpencodeServer.findOne({ orgId: identifierId }).lean();

    if (!opencode) {
      return null;
    }

    if (opencode.status !== SERVER_STATUSES.DEPLOYING) {
      return { ...opencode, identifierId: opencode.orgId };
    }

    try {
      const remote = await getOpencodeServerInfo(opencode.name);
      const serverUrl = remote.serverUrl || opencode.url;
      const ready =
        remote.status === 'running' &&
        (await isOpencodeServerReady(serverUrl));
      const nextStatus =
        ready ? SERVER_STATUSES.APPROVED : SERVER_STATUSES.DEPLOYING;

      return models.OpencodeServer.findOneAndUpdate(
        { _id: opencode._id },
        {
          $set: {
            status: nextStatus,
            url: serverUrl,
            serverId: String(remote.serverId || opencode.serverId),
          },
        },
        { new: true },
      )
        .lean()
        .then((updated) =>
          updated ? { ...updated, identifierId: updated.orgId } : updated,
        );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (message.includes('Server not found')) {
        return models.OpencodeServer.findOneAndUpdate(
          { _id: opencode._id },
          { $set: { status: SERVER_STATUSES.FAILED } },
          { new: true },
        )
          .lean()
          .then((updated) =>
            updated ? { ...updated, identifierId: updated.orgId } : updated,
          );
      }

      return { ...opencode, identifierId: opencode.orgId };
    }
  },

  getOpencodeCredentials: async (
    _root: undefined,
    { identifierId }: { identifierId: string },
    { models }: IContext,
  ) => {
    const opencode = await models.OpencodeServer.findOne({ orgId: identifierId }).lean();

    if (!opencode) {
      throw new Error('Opencode server not found');
    }

    if (opencode.serverPassword) {
      return {
        username: 'opencode',
        password: opencode.serverPassword,
      };
    }

    return getOpencodeServerPassword(opencode.name);
  },
};
