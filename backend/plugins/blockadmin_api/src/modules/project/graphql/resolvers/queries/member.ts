export const projectMemberQueries = {
  blockGetProjectMembers: async (_, { project }, { models }) => {
    return await models.ProjectMember.find({ project });
  },
};

