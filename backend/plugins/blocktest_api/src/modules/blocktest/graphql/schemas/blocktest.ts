export const types = `
  type Blocktest {
    _id: String
    name: String
    description: String
  }
`;

export const queries = `
  getBlocktest(_id: String!): Blocktest
  getBlocktests: [Blocktest]
`;

export const mutations = `
  createBlocktest(name: String!): Blocktest
  updateBlocktest(_id: String!, name: String!): Blocktest
  removeBlocktest(_id: String!): Blocktest
`;
