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
    emoji: String
    theme: String
    soulMd: String
    mentionPatterns: [String]
  }

  input UpdateAgentFileInput {
    filename: String!
    content: String!
    agentId: String
  }
`;

export const queries = `
  getAgent: Agent
  getAgentsList: [AgentItem]
  getAgentDetails(agentId: String): [AgentFile]
`;

export const mutations = `
  deployAgent(input: DeployAgentInput!): Agent
  destroyAgent: Agent
  approveAgent(input: ApproveAgentInput!): Agent
  addAgent(input: AddAgentInput!): Boolean
  updateAgentFile(input: UpdateAgentFileInput!): Boolean
`;
