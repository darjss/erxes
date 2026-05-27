export const types = `
  enum AgentDeploymentStatus {
    deploying
    pending
    approved
    failed
  }

  type AgentServer {
    _id: String

    identifierId: String
    name: String
    url: String
    token: String

    agentId: String
    serverId: String
    status: AgentDeploymentStatus!
    transferredFromSubdomain: String
    transferredAt: Date

    createdAt: Date
    updatedAt: Date
  }

  type AgentFile {
    fileName: String
    content: String
  }

  type AgentTransferCredentials {
    kind: String
    sourceSubdomain: String
    serverName: String
    serverUrl: String
    gatewayToken: String
    agentId: String
    serverId: String
    status: String
  }

  input DeployAgentInput {
    token: String!
    kimiApiKey: String!
  }

  input TransferAgentInput {
    serverName: String!
    gatewayToken: String!
    serverUrl: String
    agentId: String
    serverId: String
    sourceSubdomain: String
  }

  input ApproveAgentInput {
    code: String!
  }

  type AgentItem {
    id: String
    identity: JSON
  }

  input AddAgentInput {
    agentId: String!
    botName: String!
  }

  input UpdateAgentFileInput {
    filename: String!
    content: String!
    agentId: String
  }

  input UpdateDiscordSettingsInput {
    botToken: String!
    dmPolicy: String
  }

  input AddDiscordGuildInput {
    guildId: String!
  }

  input SetKimiApiKeyInput {
    kimiApiKey: String!
  }

  type DiscordGuild {
    guildId: String
    requireMention: Boolean
  }
`;

export const queries = `
  getAgent(identifierId: String!): AgentServer
  getAgentsList(identifierId: String!): [AgentItem]
  getAgentDetails(identifierId: String!, agentId: String): [AgentFile]
  getDiscordGuilds(identifierId: String!): [DiscordGuild]
  checkKimiKeySet(identifierId: String!): Boolean
`;

export const mutations = `
  deployAgent(identifierId: String!, input: DeployAgentInput!): AgentServer
  transferAgent(identifierId: String!, input: TransferAgentInput!): AgentServer
  createAgentTransferCredentials(identifierId: String!): AgentTransferCredentials
  destroyAgent(identifierId: String!): AgentServer
  approveAgent(identifierId: String!, input: ApproveAgentInput!): AgentServer
  addAgent(identifierId: String!, input: AddAgentInput!): Boolean
  updateAgentFile(identifierId: String!, input: UpdateAgentFileInput!): Boolean
  fixAndRestartAgent(identifierId: String!): Boolean
  updateDiscordSettings(identifierId: String!, input: UpdateDiscordSettingsInput!): Boolean
  addDiscordGuild(identifierId: String!, input: AddDiscordGuildInput!): Boolean
  setKimiApiKey(identifierId: String!, input: SetKimiApiKeyInput!): Boolean
`;
