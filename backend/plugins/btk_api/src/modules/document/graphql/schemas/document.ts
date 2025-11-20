export const types = `
  type BtkDocument {
    _id: String
    name: String
    type: String
    itemType: String
    itemId: String
    visibility: BtkDocumentVisibility
    createdBy: String
    attachment: String
    description: String
  }

  input BtkDocumentInput {
    name: String!
    type: String!
    itemType: String!
    itemId: String!
    visibility: BtkDocumentVisibility!
    createdBy: String!
    attachment: String!
    description: String!
  }

  enum BtkDocumentVisibility {
    public
    private
    agents_only
  }
`;

export const queries = `
  btkGetDocument(_id: String!): BtkDocument
  btkGetDocuments(itemType: String!, itemId: String!): [BtkDocument]
`;

export const mutations = `
  btkCreateDocument(input: BtkDocumentInput!): BtkDocument
  btkUpdateDocument(_id: String!, input: BtkDocumentInput!): BtkDocument
  btkDeleteDocument(_id: String!): BtkDocument
`;
