export const types = `
  type BlockProjectMember {
    _id: String
    memberId: String
    project: String
    role: String
  }

  enum BlockProjectMemberRole {
    admin
    member
    lead
  }

  input BlockProjectMemberInput {
    memberId: String
    project: String
    role: BlockProjectMemberRole
  }
`;

export const queries = `
  blockGetProjectMembers(project: String!): [BlockProjectMember]
`;

export const mutations = `
  blockAddProjectMembers(project: String!, memberIds: [String!]!): [BlockProjectMember]
  blockUpdateProjectMember(_id: String!, role: BlockProjectMemberRole): BlockProjectMember
  blockDeleteProjectMember(_id: String!): BlockProjectMember
`;
