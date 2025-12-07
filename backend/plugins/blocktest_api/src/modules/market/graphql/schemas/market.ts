export const types = `
  type CVMarket {
    _id: String
    name: String
    description: String
  }
`;

export const queries = `
  getCVMarket(_id: String!): CVMarket
  getCVMarkets: [CVMarket]
`;

export const mutations = `
  createCVMarket(name: String!): CVMarket
  updateCVMarket(_id: String!, name: String!): CVMarket
  removeCVMarket(_id: String!): CVMarket
`;
