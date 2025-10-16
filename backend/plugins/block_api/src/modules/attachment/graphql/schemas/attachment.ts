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

  input BlockAttachmentInput {
    itemType: String!
    itemId: String!
    attachment: String!
    order: Int
  }
`;

export const queries = `
  blockGetAttachment(_id: String!): BlockAttachment
  blockGetAttachments(itemType: String!, itemId: String!): [BlockAttachment]
`;

export const mutations = `
  blockCreateAttachment(input: BlockAttachmentInput!): BlockAttachment
  blockUpdateAttachment(_id: String!, input: BlockAttachmentInput!): BlockAttachment
  blockDeleteAttachment(_id: String!): BlockAttachment
`;
