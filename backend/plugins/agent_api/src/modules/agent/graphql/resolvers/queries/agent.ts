import { IContext } from '~/connectionResolvers';
import {
  assertIdentifierAccess,
  assertIdentifierManageAccess,
} from '~/modules/assistantOrg/permissions';
import { ensureLegacyIdentifierLinks } from '~/modules/assistantOrg/utils';
import {
  checkKimiKeySet,
  getAgentDetails,
  getGatewayToken,
  listAgents,
  listDiscordGuilds,
} from '~/modules/agent/utils';
import {
  createDiscordConnectUrl,
  getDiscordInstallation,
  listDiscordBindings,
  listDiscordChannels,
  listDiscordInstallations,
} from '~/modules/agent/discordGatewayClient';

const assertAssistantManageAccess = async (
  models: IContext['models'],
  assistantId: string,
  user: IContext['user'],
) => {
  const identifier = await assertIdentifierManageAccess(
    models,
    assistantId,
    user,
  );

  if (identifier.kind && identifier.kind !== 'assistant') {
    throw new Error('This identifier is not an AI Assistant');
  }

  return identifier;
};

export const agentQueries = {
  getAgent: async (
    _root: undefined,
    { identifierId }: { identifierId: string },
    { models, user }: IContext,
  ) => {
    await ensureLegacyIdentifierLinks(models);
    await assertIdentifierAccess(models, identifierId, user);

    const agent = await models.AgentServer.findOne({ identifierId }).lean();

    if (!agent) {
      return null;
    }

    if (agent.token) {
      return { ...agent, identifierId: agent.identifierId };
    }

    try {
      const token = await getGatewayToken(agent.name);
      return { ...agent, token, identifierId: agent.identifierId };
    } catch {
      return { ...agent, identifierId: agent.identifierId };
    }
  },

  getAgentsList: async (
    _root: undefined,
    { identifierId }: { identifierId: string },
    { models, user }: IContext,
  ) => {
    await ensureLegacyIdentifierLinks(models);
    await assertIdentifierAccess(models, identifierId, user);

    const server = await models.AgentServer.findOne({ identifierId }).lean();

    if (!server) {
      throw new Error('Agent server not found');
    }

    return listAgents(server.name);
  },

  getAgentDetails: async (
    _root: undefined,
    { identifierId, agentId }: { identifierId: string; agentId?: string },
    { models, user }: IContext,
  ) => {
    await ensureLegacyIdentifierLinks(models);
    await assertIdentifierAccess(models, identifierId, user);

    const server = await models.AgentServer.findOne({ identifierId }).lean();

    if (!server) {
      throw new Error('Agent server not found');
    }

    return getAgentDetails(server.name, agentId);
  },

  getDiscordGuilds: async (
    _root: undefined,
    { identifierId }: { identifierId: string },
    { models, user }: IContext,
  ) => {
    await ensureLegacyIdentifierLinks(models);
    await assertIdentifierAccess(models, identifierId, user);

    const server = await models.AgentServer.findOne({ identifierId }).lean();

    if (!server) {
      throw new Error('Agent server not found');
    }

    return listDiscordGuilds(server.name);
  },

  checkKimiKeySet: async (
    _root: undefined,
    { identifierId }: { identifierId: string },
    { models, user }: IContext,
  ) => {
    await ensureLegacyIdentifierLinks(models);
    await assertIdentifierAccess(models, identifierId, user);

    const server = await models.AgentServer.findOne({ identifierId }).lean();

    if (!server) {
      throw new Error('Agent server not found');
    }

    return checkKimiKeySet(server.name);
  },

  agentDiscordConnectUrl: async (
    _root: undefined,
    { assistantId, returnUrl }: { assistantId: string; returnUrl?: string },
    { models, subdomain, user }: IContext,
  ) => {
    await assertAssistantManageAccess(models, assistantId, user);

    const server = await models.AgentServer.findOne({
      identifierId: assistantId,
    }).lean();

    if (!server) {
      throw new Error('Assistant server not found');
    }

    return createDiscordConnectUrl({
      tenantId: subdomain,
      assistantId,
      erxesUserId: user?._id,
      returnUrl,
    });
  },

  agentDiscordInstallations: async (
    _root: undefined,
    { assistantId }: { assistantId: string },
    { models, subdomain, user }: IContext,
  ) => {
    await assertAssistantManageAccess(models, assistantId, user);

    const { installations } = await listDiscordInstallations({
      tenantId: subdomain,
      assistantId,
      status: 'connected',
    });

    return installations;
  },

  agentDiscordChannels: async (
    _root: undefined,
    {
      assistantId,
      installationId,
    }: { assistantId: string; installationId: string },
    { models, subdomain, user }: IContext,
  ) => {
    await assertAssistantManageAccess(models, assistantId, user);

    const { installation } = await getDiscordInstallation(installationId);

    if (installation.tenantId !== subdomain) {
      throw new Error('Discord installation does not belong to this tenant');
    }

    const { channels } = await listDiscordChannels(installationId);

    return channels;
  },

  agentDiscordBindings: async (
    _root: undefined,
    { assistantId }: { assistantId: string },
    { models, subdomain, user }: IContext,
  ) => {
    await assertAssistantManageAccess(models, assistantId, user);

    const { bindings } = await listDiscordBindings({
      tenantId: subdomain,
      assistantId,
    });

    return bindings;
  },
};
