import { IContext } from '~/connectionResolvers';
import {
  checkKimiKeySet,
  getAgentDetails,
  getGatewayToken,
  listAgents,
  listDiscordGuilds,
} from '~/modules/agent/utils';

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

    try {
      const token = await getGatewayToken(agent.name);
      return { ...agent, token };
    } catch {
      return agent;
    }
  },

  getAgentsList: async (
    _root: undefined,
    _args: undefined,
    { models }: IContext,
  ) => {
    const server = await models.AgentServer.findOne({}).lean();

    if (!server) {
      throw new Error('Agent server not found');
    }

    return listAgents(server.name);
  },

  getAgentDetails: async (
    _root: undefined,
    { agentId }: { agentId?: string },
    { models }: IContext,
  ) => {
    const server = await models.AgentServer.findOne({}).lean();

    if (!server) {
      throw new Error('Agent server not found');
    }

    return getAgentDetails(server.name, agentId);
  },

  getDiscordGuilds: async (
    _root: undefined,
    _args: undefined,
    { models }: IContext,
  ) => {
    const server = await models.AgentServer.findOne({}).lean();

    if (!server) {
      throw new Error('Agent server not found');
    }

    return listDiscordGuilds(server.name);
  },

  checkKimiKeySet: async (
    _root: undefined,
    _args: undefined,
    { models }: IContext,
  ) => {
    const server = await models.AgentServer.findOne({}).lean();

    if (!server) {
      throw new Error('Agent server not found');
    }

    return checkKimiKeySet(server.name);
  },
};
