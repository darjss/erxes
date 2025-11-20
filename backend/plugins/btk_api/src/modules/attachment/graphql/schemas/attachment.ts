export const types = `
  type BtkAttachment {
    _id: String
    itemType: String
    itemId: String
    attachment: String
    order: Int
    createdAt: String
    updatedAt: String
  }

  input BtkAttachmentInput {
    itemType: String!
    itemId: String!
    attachment: String!
    order: Int
  }
`;

export const queries = `
  btkGetAttachment(_id: String!): BtkAttachment
  btkGetAttachments(itemType: String!, itemId: String!): [BtkAttachment]
`;

export const mutations = `
  btkCreateAttachment(input: BtkAttachmentInput!): BtkAttachment
  btkUpdateAttachment(_id: String!, input: BtkAttachmentInput!): BtkAttachment
  btkDeleteAttachment(_id: String!): BtkAttachment
`;
