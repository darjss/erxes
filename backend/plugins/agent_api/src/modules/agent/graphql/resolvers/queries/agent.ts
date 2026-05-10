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
    { identifierId }: { identifierId: string },
    { models }: IContext,
  ) => {
    const agent = await models.AgentServer.findOne({ orgId: identifierId }).lean();

    if (!agent) {
      return null;
    }

    try {
      const token = await getGatewayToken(agent.name);
      return { ...agent, token, identifierId: agent.orgId };
    } catch {
      return { ...agent, identifierId: agent.orgId };
    }
  },

  getAgentsList: async (
    _root: undefined,
    { identifierId }: { identifierId: string },
    { models }: IContext,
  ) => {
    const server = await models.AgentServer.findOne({ orgId: identifierId }).lean();

    if (!server) {
      throw new Error('Agent server not found');
    }

    return listAgents(server.name);
  },

  getAgentDetails: async (
    _root: undefined,
    { identifierId, agentId }: { identifierId: string; agentId?: string },
    { models }: IContext,
  ) => {
    const server = await models.AgentServer.findOne({ orgId: identifierId }).lean();

    if (!server) {
      throw new Error('Agent server not found');
    }

    return getAgentDetails(server.name, agentId);
  },

  getDiscordGuilds: async (
    _root: undefined,
    { identifierId }: { identifierId: string },
    { models }: IContext,
  ) => {
    const server = await models.AgentServer.findOne({ orgId: identifierId }).lean();

    if (!server) {
      throw new Error('Agent server not found');
    }

    return listDiscordGuilds(server.name);
  },

  checkKimiKeySet: async (
    _root: undefined,
    { identifierId }: { identifierId: string },
    { models }: IContext,
  ) => {
    const server = await models.AgentServer.findOne({ orgId: identifierId }).lean();

    if (!server) {
      throw new Error('Agent server not found');
    }

    return checkKimiKeySet(server.name);
  },
};
