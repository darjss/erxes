export const types = `
  type BlockAdminAttachment {
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
  blockAdminGetAttachment(_id: String!): BlockAdminAttachment
  blockAdminGetAttachments(itemType: String!, itemId: String!): [BlockAdminAttachment]
`;
