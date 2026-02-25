import { IContext } from '~/connectionResolvers';

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

    return agent;
  },
};
