export const types = `
  type CVClient {
    _id: String
    name: String
    description: String
  }
`;

export const queries = `
  getCVClient(_id: String!): CVClient
  getCVClients: [CVClient]
`;

export const mutations = `
  createCVClient(name: String!): CVClient
  updateCVClient(_id: String!, name: String!): CVClient
  removeCVClient(_id: String!): CVClient
`;
