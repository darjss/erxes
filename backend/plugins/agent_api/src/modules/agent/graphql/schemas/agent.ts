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

  input DeployAgentInput {
    name: String!
    token: String!
  }

  input ApproveAgentInput {
    code: String!
  }
`;

export const queries = `
  getAgent: Agent
`;

export const mutations = `
  deployAgent(input: DeployAgentInput!): Agent
  approveAgent(input: ApproveAgentInput!): Agent
`;
