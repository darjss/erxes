export const types = `
  type BlockAttachment {
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
  blockGetAttachment(_id: String!): BlockAttachment
  blockGetAttachments(itemType: String!, itemId: String!): [BlockAttachment]
`;
