export const types = `
  type Agent {
    _id: String

    name: String
    url: String
    token: String

    agentId: String
    serverId: String
    status: String

    createdAt: Date
    updatedAt: Date
  }

  type AgentFile {
    fileName: String
    content: String
  }

  input DeployAgentInput {
    name: String!
    token: String!
    kimiApiKey: String!
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
  getAgent: Agent
  getAgentsList: [AgentItem]
  getAgentDetails(agentId: String): [AgentFile]
  getDiscordGuilds: [DiscordGuild]
  checkKimiKeySet: Boolean
`;

export const mutations = `
  deployAgent(input: DeployAgentInput!): Agent
  destroyAgent: Agent
  approveAgent(input: ApproveAgentInput!): Agent
  addAgent(input: AddAgentInput!): Boolean
  updateAgentFile(input: UpdateAgentFileInput!): Boolean
  fixAndRestartAgent: Boolean
  updateDiscordSettings(input: UpdateDiscordSettingsInput!): Boolean
  addDiscordGuild(input: AddDiscordGuildInput!): Boolean
  setKimiApiKey(input: SetKimiApiKeyInput!): Boolean
`;
