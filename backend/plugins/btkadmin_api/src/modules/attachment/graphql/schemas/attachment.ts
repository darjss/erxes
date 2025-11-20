export const types = `
  type BtkAdminAttachment {
    _id: String
    itemType: String
    itemId: String
    attachment: String
    order: Int
    createdAt: String
    updatedAt: String
  }
`;

export const queries = `
  btkAdminGetAttachment(_id: String!): BtkAdminAttachment
  btkAdminGetAttachments(itemType: String!, itemId: String!): [BtkAdminAttachment]
`;
