export const types = `
  type BlockDocument {
    _id: String
    name: String
    type: String
    itemType: String
    itemId: String
    visibility: BlockDocumentVisibility
    attachment: String
    description: String
    createdBy: String
    createdAt: Date
    updatedAt: Date
  }

  input BlockDocumentInput {
    name: String!
    type: String!
    itemType: String!
    itemId: String!
    visibility: BlockDocumentVisibility!
    attachment: String
    description: String
  }

  enum BlockDocumentVisibility {
    public
    private
    agents_only
  }
`;

export const queries = `
  blockGetDocument(_id: String!): BlockDocument
  blockGetDocuments(itemType: String!, itemId: String!): [BlockDocument]
`;

export const mutations = `
  blockCreateDocument(input: BlockDocumentInput!): BlockDocument
  blockUpdateDocument(_id: String!, input: BlockDocumentInput!): BlockDocument
  blockDeleteDocument(_id: String!): BlockDocument
`;
