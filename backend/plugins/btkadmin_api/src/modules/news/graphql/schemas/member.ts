export const types = `
  type BtkAdminNewsMember {
    _id: String
    memberId: String
    news: String
    role: String
  }
`;

export const queries = `
  btkAdminGetNewsMembers(news: String!): [BtkAdminNewsMember]
`;
