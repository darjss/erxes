export const types = `
  type BlockAdminDocument {
    _id: String
    name: String
    type: String
    itemType: String
    itemId: String
    visibility: BlockAdminDocumentVisibility
    createdBy: String
    attachment: String
    description: String
  }

  enum BlockAdminDocumentVisibility {
    public
    private
    agents_only
  }
`;

export const queries = `
  blockAdminGetDocument(_id: String!): BlockAdminDocument
  blockAdminGetDocuments(itemType: String!, itemId: String!): [BlockAdminDocument]
`;
