export const types = `
  type BlockOpptyStatus {
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

  input BlockOpptyStatusInput {
    _id: String
    name: String!
    projectId: String!
    description: String
    color: String
    type: String
  }
`;

export const queries = `
  getBlockOpptyStatus(_id: String!): BlockOpptyStatus
  getBlockOpptyStatuses(projectId: String!): [BlockOpptyStatus]
  getBlockOpptyStatusTypes: JSON
`;

export const mutations = `
  createBlockOpptyStatus(input: BlockOpptyStatusInput!): BlockOpptyStatus
  updateBlockOpptyStatus(_id: String!, input: BlockOpptyStatusInput!): BlockOpptyStatus
  updateBlockOpptyStatusOrder(_id: String!, order: Float!): BlockOpptyStatus
  removeBlockOpptyStatus(_id: String!): BlockOpptyStatus
`;
