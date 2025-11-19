export const types = `
  type BtkNewsMember {
    _id: String
    memberId: String
    news: String
    role: String
  }

  enum BtkNewsMemberRole {
    admin
    member
    lead
  }

  input BtkNewsMemberInput {
    memberId: String
    news: String
    role: BtkNewsMemberRole
  }
`;

export const queries = `
  btkGetNewsMembers(news: String!): [BtkNewsMember]
`;

export const mutations = `
  btkAddNewsMembers(news: String!, memberIds: [String!]!): [BtkNewsMember]
  btkUpdateNewsMember(_id: String!, role: BtkNewsMemberRole): BtkNewsMember
  btkDeleteNewsMember(_id: String!): BtkNewsMember
`;
