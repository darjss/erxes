import { IContext } from '~/connectionResolvers';
import { SERVER_STATUSES } from '~/modules/agent/constants';
import {
  addAgent,
  addDiscordGuild,
  approveServer,
  deployServer,
  destroyServer,
  fixAndRestartServer,
  updateAgentFile,
  updateDiscordSettings,
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

  addAgent: async (
    _root: undefined,
    {
      input,
    }: {
      input: {
        agentId: string;
        botName: string;
        emoji?: string;
        theme?: string;
        soulMd?: string;
        mentionPatterns?: string[];
      };
    },
    { models }: IContext,
  ) => {
    const server = await models.AgentServer.findOne({}).lean();

    if (!server) {
      throw new Error('Agent server not found');
    }

    // Fire-and-forget — agent registration happens in the background
    addAgent(server.name, input).catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      console.error('addAgent failed:', message);
    });

    return true;
  },

  updateAgentFile: async (
    _root: undefined,
    {
      input,
    }: { input: { filename: string; content: string; agentId?: string } },
    { models }: IContext,
  ) => {
    const server = await models.AgentServer.findOne({}).lean();

    if (!server) {
      throw new Error('Agent server not found');
    }

    try {
      await updateAgentFile(
        server.name,
        input.filename,
        input.content,
        input.agentId,
      );
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(message);
    }
  },

  fixAndRestartAgent: async (
    _root: undefined,
    _args: undefined,
    { models }: IContext,
  ) => {
    const server = await models.AgentServer.findOne({}).lean();

    if (!server) {
      throw new Error('Agent server not found');
    }

    try {
      await fixAndRestartServer(server.name);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(message);
    }
  },

  updateDiscordSettings: async (
    _root: undefined,
    {
      input,
    }: { input: { botToken: string; dmPolicy?: 'pairing' | 'open' } },
    { models }: IContext,
  ) => {
    const server = await models.AgentServer.findOne({}).lean();

    if (!server) {
      throw new Error('Agent server not found');
    }

    try {
      await updateDiscordSettings(server.name, input.botToken, input.dmPolicy);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(message);
    }
  },

  addDiscordGuild: async (
    _root: undefined,
    { input }: { input: { guildId: string } },
    { models }: IContext,
  ) => {
    const server = await models.AgentServer.findOne({}).lean();

    if (!server) {
      throw new Error('Agent server not found');
    }

    try {
      await addDiscordGuild(server.name, input.guildId);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(message);
    }
  },
};
