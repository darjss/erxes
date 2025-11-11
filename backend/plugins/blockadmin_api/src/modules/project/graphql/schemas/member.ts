export const types = `
  type BlockAdminProjectMember {
    _id: String
    memberId: String
    project: String
    role: String
  }
`;

export const queries = `
  blockAdminGetProjectMembers(project: String!): [BlockAdminProjectMember]
`;
