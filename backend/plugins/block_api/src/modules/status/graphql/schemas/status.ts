export const types = `
  type BlockStatus {
    _id: String!
    name: String!
    projectId: String!
    description: String
    color: String
    order: Int
    type: String
    createdAt: Date
    updatedAt: Date
  }
  
  input BlockStatusInput {
    _id: String
    name: String!
    projectId: String!
    description: String
    color: String
    type: String
    order: Int
  }
`;

export const queries = `
  getBlockStatus(_id: String!): BlockStatus
  getBlockStatuses(projectId: String!, type: String): [BlockStatus]
`;

export const mutations = `
  createBlockStatus(input: BlockStatusInput!): BlockStatus
  updateBlockStatus(_id: String!, input: BlockStatusInput!): BlockStatus
  removeBlockStatus(_id: String!): BlockStatus
`;
