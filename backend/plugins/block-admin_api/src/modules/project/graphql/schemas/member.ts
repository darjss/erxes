export const types = `
  type BlockProjectMember {
    _id: String
    memberId: String
    project: String
    role: String
  }
`;

export const queries = `
  blockGetProjectMembers(project: String!): [BlockProjectMember]
`;
