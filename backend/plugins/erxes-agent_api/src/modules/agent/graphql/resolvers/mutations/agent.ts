import { ExpectedError } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { IMastraAgent } from '@/agent/@types/agent';
import { isAgentAdmin } from '@/agent/utils';

export const agentMutations = {
  mastraAgentCreate: async (
    _parent: undefined,
    { doc }: { doc: IMastraAgent },
    { models, user, checkPermission }: IContext,
  ) => {
    await checkPermission('agentsCreate');
    if (!user?._id) throw new ExpectedError('Login required');

    const admin = isAgentAdmin(user);

    if (!admin && doc.visibility && doc.visibility !== 'private') {
      throw new ExpectedError('Users may only create private agents');
    }

    if (!admin) {
      const [settings, userSettings, count] = await Promise.all([
        models.MastraSettings.getSettings(),
        models.MastraUserSettings.getUserSettings(user._id),
        models.MastraAgent.countDocuments({ createdBy: user._id }),
      ]);
      const quota = userSettings?.agentQuota ?? settings?.defaultAgentQuota ?? 0;
      if (quota > 0 && count >= quota) {
        throw new ExpectedError(`Agent quota reached (${quota})`);
      }
    }

    return models.MastraAgent.createAgent({ ...doc, createdBy: user._id });
  },

  mastraAgentUpdate: async (
    _parent: undefined,
    { _id, doc }: { _id: string; doc: Partial<IMastraAgent> },
    { models, user, checkPermission }: IContext,
  ) => {
    await checkPermission('agentsEdit');
    if (!user?._id) throw new ExpectedError('Login required');
    const admin = isAgentAdmin(user);
    return models.MastraAgent.updateAgent(_id, doc, admin ? undefined : user._id);
  },

  mastraAgentRemove: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models, user, checkPermission }: IContext,
  ) => {
    await checkPermission('agentsRemove');
    if (!user?._id) throw new ExpectedError('Login required');
    const admin = isAgentAdmin(user);
    return models.MastraAgent.removeAgent(_id, admin ? undefined : user._id);
  },
};
