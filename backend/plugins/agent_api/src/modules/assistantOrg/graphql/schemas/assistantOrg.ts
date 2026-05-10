export const types = `
  type Identifier {
    _id: String
    name: String
    slug: String
    kind: String
    description: String
    createdAt: Date
    updatedAt: Date
  }

  input CreateIdentifierInput {
    name: String!
    kind: String!
    description: String
  }

  input UpdateIdentifierInput {
    name: String!
    description: String
  }
`;

export const queries = `
  getIdentifiers(kind: String): [Identifier]
  getIdentifier(identifierId: String!): Identifier
`;

export const mutations = `
  createIdentifier(input: CreateIdentifierInput!): Identifier
  updateIdentifier(identifierId: String!, input: UpdateIdentifierInput!): Identifier
  deleteIdentifier(identifierId: String!): Boolean
`;
