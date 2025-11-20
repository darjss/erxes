export const types = `
  type BtkAdminDocument {
    _id: String
    name: String
    type: String
    itemType: String
    itemId: String
    visibility: BtkAdminDocumentVisibility
    createdBy: String
    attachment: String
    description: String
  }

  enum BtkAdminDocumentVisibility {
    public
    private
    agents_only
  }
`;

export const queries = `
  btkAdminGetDocument(_id: String!): BtkAdminDocument
  btkAdminGetDocuments(itemType: String!, itemId: String!): [BtkAdminDocument]
`;
