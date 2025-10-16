import { requireLogin } from 'erxes-api-shared/core-modules';

export const projectMemberQueries = {
  blockGetProjectMembers: async (_, { project }, { models }) => {
    return await models.ProjectMember.find({ project });
  },
};

requireLogin(projectMemberQueries, 'blockGetProjectMembers');
