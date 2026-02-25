import { IContext } from '~/connectionResolvers';
import { SERVER_STATUSES } from '~/modules/agent/constants';
import {
  approveServer,
  deployServer,
  destroyServer,
} from '~/modules/agent/utils';

export const agentMutations = {
  deployAgent: async (
    _root: undefined,
    { input }: { input: { name: string; token: string } },
    { models, subdomain }: IContext,
  ) => {
    const { name, token } = input || {};

    const agentServer = await models.AgentServer.findOne({}).lean();

    if (agentServer) {
      return agentServer;
    }

    try {
      const server = await deployServer({
        orgId: subdomain,
        agentId: name,
        discordBotToken: token,
      });

      if (!server) {
        throw new Error('Failed to deploy server');
      }

      return models.AgentServer.create({
        agentId: name,
        name: server.serverName,
        url: server.serverUrl,
        token: server.gatewayToken,
        serverId: server.serverId,
        status: SERVER_STATUSES.DEPLOYING,
      });
    } catch (error) {
      await models.AgentServer.deleteOne({});

      const message = error instanceof Error ? error.message : String(error);
      throw new Error(message);
    }
  },

  approveAgent: async (
    _root: undefined,
    { input }: { input: { code: string } },
    { models }: IContext,
  ) => {
    const { code } = input || {};

    const agent = await models.AgentServer.findOne({}).lean();

    if (!agent) {
      throw new Error('Agent not found');
    }

    try {
      await approveServer(agent, code);

      return models.AgentServer.findOneAndUpdate(
        { _id: agent._id },
        { $set: { status: SERVER_STATUSES.APPROVED, approveCode: code } },
        { new: true },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(message);
    }
  },

  destroyAgent: async (
    _root: undefined,
    _args: undefined,
    { models }: IContext,
  ) => {
    const agent = await models.AgentServer.findOne({}).lean();

    if (!agent) {
      throw new Error('Agent not found');
    }

    try {
      await destroyServer(agent);

      await models.AgentServer.deleteOne({});

      return agent;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(message);
    }
  },
};
