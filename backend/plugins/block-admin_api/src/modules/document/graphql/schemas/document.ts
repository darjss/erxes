export const types = `
  type BlockDocument {
    _id: String
    name: String
    type: String
    itemType: String
    itemId: String
    visibility: BlockDocumentVisibility
    createdBy: String
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
