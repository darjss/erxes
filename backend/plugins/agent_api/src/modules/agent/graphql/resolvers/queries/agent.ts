import { IContext } from '~/connectionResolvers';
import { SERVER_STATUSES } from '~/modules/agent/constants';

export const agentQueries = {
  getAgent: async (
    _root: undefined,
    _args: undefined,
    { models }: IContext,
  ) => {
    const agent = await models.AgentServer.findOne({}).lean();

    if (!agent) {
      throw new Error('Agent not found');
    }

    if (agent?.status === SERVER_STATUSES.PENDING && agent.approveCode) {
      return models.AgentServer.findOneAndUpdate(
        { _id: agent._id },
        { set: { status: SERVER_STATUSES.APPROVED } },
        { new: true },
      );
    }

    return agent;
  },
};
