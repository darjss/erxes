import { IContext } from '~/connectionResolvers';
import { SERVER_STATUSES } from '~/modules/agent/constants';
import {
  addAgent,
  addDiscordGuild,
  approveServer,
  deployServer,
  destroyServer,
  fixAndRestartServer,
  setKimiApiKey,
  updateAgentFile,
  updateDiscordSettings,
} from '~/modules/agent/utils';

export const agentMutations = {
  deployAgent: async (
    _root: undefined,
    {
      identifierId,
      input,
    }: {
      identifierId: string;
      input: { token: string; kimiApiKey: string };
    },
    { models, subdomain }: IContext,
  ) => {
    const { token, kimiApiKey } = input || {};

    if (!token?.trim()) {
      throw new Error('Discord bot token is required');
    }

    if (!kimiApiKey?.trim()) {
      throw new Error('kimiApiKey is required');
    }

    const identifier = await models.Identifier.findById(identifierId).lean();

    if (!identifier) {
      throw new Error('Identifier not found');
    }

    if (identifier.kind && identifier.kind !== 'assistant') {
      throw new Error(
        'This identifier belongs to AI Agents and cannot deploy OpenClaw.',
      );
    }

    const agentServer = await models.AgentServer.findOne({ orgId: identifierId }).lean();

    if (agentServer) {
      return { ...agentServer, identifierId: agentServer.orgId };
    }

    try {
      const server = await deployServer({
        orgId: subdomain,
        agentId: identifier.slug,
        discordBotToken: token.trim(),
        kimiApiKey,
      });

      if (!server) {
        throw new Error('Failed to deploy server');
      }

      return models.AgentServer.create({
        orgId: identifierId,
        agentId: identifier.slug,
        name: server.serverName,
        url: server.serverUrl,
        token: server.gatewayToken,
        serverId: server.serverId,
        status: SERVER_STATUSES.DEPLOYING,
      });
    } catch (error) {
      await models.AgentServer.deleteOne({ orgId: identifierId });

      const message = error instanceof Error ? error.message : String(error);
      throw new Error(message);
    }
  },

  approveAgent: async (
    _root: undefined,
    {
      identifierId,
      input,
    }: { identifierId: string; input: { code: string } },
    { models }: IContext,
  ) => {
    const { code } = input || {};

    const agent = await models.AgentServer.findOne({ orgId: identifierId }).lean();

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
    { identifierId }: { identifierId: string },
    { models }: IContext,
  ) => {
    const agent = await models.AgentServer.findOne({ orgId: identifierId }).lean();

    if (!agent) {
      throw new Error('Agent not found');
    }

    try {
      await destroyServer(agent);

      await models.AgentServer.deleteOne({ _id: agent._id });

      return { ...agent, identifierId: agent.orgId };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(message);
    }
  },

  addAgent: async (
    _root: undefined,
    {
      identifierId,
      input,
    }: {
      identifierId: string;
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
    const server = await models.AgentServer.findOne({ orgId: identifierId }).lean();

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
      identifierId,
      input,
    }: {
      identifierId: string;
      input: { filename: string; content: string; agentId?: string };
    },
    { models }: IContext,
  ) => {
    const server = await models.AgentServer.findOne({ orgId: identifierId }).lean();

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
    { identifierId }: { identifierId: string },
    { models }: IContext,
  ) => {
    const server = await models.AgentServer.findOne({ orgId: identifierId }).lean();

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
      identifierId,
      input,
    }: {
      identifierId: string;
      input: { botToken: string; dmPolicy?: 'pairing' | 'open' };
    },
    { models }: IContext,
  ) => {
    const server = await models.AgentServer.findOne({ orgId: identifierId }).lean();

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
    {
      identifierId,
      input,
    }: { identifierId: string; input: { guildId: string } },
    { models }: IContext,
  ) => {
    const server = await models.AgentServer.findOne({ orgId: identifierId }).lean();

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

  setKimiApiKey: async (
    _root: undefined,
    {
      identifierId,
      input,
    }: { identifierId: string; input: { kimiApiKey: string } },
    { models }: IContext,
  ) => {
    const server = await models.AgentServer.findOne({ orgId: identifierId }).lean();

    if (!server) {
      throw new Error('Agent server not found');
    }

    if (!input?.kimiApiKey) {
      throw new Error('kimiApiKey is required');
    }

    try {
      await setKimiApiKey(server.name, input.kimiApiKey);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(message);
    }
  },
};
