import { IContext } from '~/connectionResolvers';
import { prepareChatTurn, persistTurn, runAgentTurn } from '@/agent/turn';
import { isAgentAdmin } from '@/agent/utils';
import { IMastraAgentDocument } from '@/agent/@types/agent';

export const agentQueries = {
  mastraAgents: async (
    _parent: undefined,
    _args: undefined,
    { models, user, checkPermission }: IContext,
  ) => {
    await checkPermission('agentsView');
    const admin = isAgentAdmin(user);
    return models.MastraAgent.getAgents(
      user?._id,
      admin,
      user?.branchIds ?? [],
      user?.departmentIds ?? [],
    );
  },

  mastraAgent: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models, user, checkPermission }: IContext,
  ) => {
    await checkPermission('agentsView');
    const admin = isAgentAdmin(user);
    return models.MastraAgent.getAgent(
      _id,
      user?._id,
      admin,
      user?.branchIds ?? [],
      user?.departmentIds ?? [],
    );
  },

  mastraAgentsMain: async (
    _parent: undefined,
    params: { page?: number; perPage?: number; searchValue?: string },
    { models, user, checkPermission }: IContext,
  ) => {
    await checkPermission('agentsView');
    const admin = isAgentAdmin(user);
    return models.MastraAgent.getAgentsList({
      ...(params || {}),
      userId: user?._id,
      isAdmin: admin,
      teamIds: user?.branchIds ?? [],
      deptIds: user?.departmentIds ?? [],
    });
  },

  mastraMyAgentQuotaStatus: async (
    _parent: undefined,
    _args: undefined,
    { models, user, checkPermission }: IContext,
  ) => {
    await checkPermission('agentsCreate');
    if (!user?._id) throw new ExpectedError('Login required');
    const admin = isAgentAdmin(user);
    if (admin) return { count: 0, quota: 0, atQuota: false };
    const [settings, userSettings, count] = await Promise.all([
      models.MastraSettings.getSettings(),
      models.MastraUserSettings.getUserSettings(user._id),
      models.MastraAgent.countDocuments({ createdBy: user._id }),
    ]);
    const quota = userSettings?.agentQuota ?? settings?.defaultAgentQuota ?? 0;
    return { count, quota, atQuota: quota > 0 && count >= quota };
  },

  mastraAgentChat: async (
    _parent: undefined,
    {
      agentId,
      message,
      threadId,
    }: { agentId: string; message: string; threadId?: string },
    { models, user, subdomain, checkPermission }: IContext,
  ) => {
    await checkPermission('agentsChat');
    if (!user?._id) throw new ExpectedError('Login required');

    const prepared = await prepareChatTurn({
      models,
      subdomain,
      user,
      agentId,
      message,
      threadId,
    });

    const { agent, convo, authCtx, memoryBinding } = prepared;
    const reply = await runAgentTurn({
      agent,
      convo,
      message,
      authCtx,
      memory: memoryBinding,
    });

    await persistTurn({ models, prepared, message, reply });

    return reply;
  },
};

export const agentCustomResolvers = {
  MastraAgent: {
    isOwnAgent: (agent: IMastraAgentDocument, _args: unknown, { user }: IContext) =>
      Boolean(user?._id && agent.createdBy === user._id),
  },
};
