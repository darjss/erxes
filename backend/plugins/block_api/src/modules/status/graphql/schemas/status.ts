export const types = `
  type BlockStatus {
    _id: String!
    name: String!
    projectId: String!
    description: String
    color: String
    order: Float
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
  }
`;

export const queries = `
  getBlockStatus(_id: String!): BlockStatus
  getBlockStatuses(projectId: String!): [BlockStatus]
  getBlockStatusTypes(projectId: String!): [BlockStatus]
`;

export const mutations = `
  createBlockStatus(input: BlockStatusInput!): BlockStatus
  updateBlockStatus(_id: String!, input: BlockStatusInput!): BlockStatus
  updateBlockStatusOrder(_id: String!, order: Float!): BlockStatus
  removeBlockStatus(_id: String!): BlockStatus
`;
