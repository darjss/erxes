export const types = `
  type BtkProjectMember {
    _id: String
    memberId: String
    project: String
    role: String
  }

  enum BtkProjectMemberRole {
    admin
    member
    lead
  }

  input BtkProjectMemberInput {
    memberId: String
    project: String
    role: BtkProjectMemberRole
  }
`;

export const queries = `
  btkGetProjectMembers(project: String!): [BtkProjectMember]
`;

export const mutations = `
  btkAddProjectMembers(project: String!, memberIds: [String!]!): [BtkProjectMember]
  btkUpdateProjectMember(_id: String!, role: BtkProjectMemberRole): BtkProjectMember
  btkDeleteProjectMember(_id: String!): BtkProjectMember
`;
