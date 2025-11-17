import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const projectMemberMutations = {
  btkAddProjectMembers: async (
    _parent: undefined,
    { project, memberIds }: { project: string; memberIds: string[] },
    { models }: IContext,
  ) => {
    return models.ProjectMember.addProjectMembers(
      memberIds.map((memberId) => ({
        memberId,
        project,
        role: 'member',
      })),
    );
  },

  btkUpdateProjectMember: async (
    _parent: undefined,
    { _id, role }: { _id: string; role: string },
    { models }: IContext,
  ) => {
    return models.ProjectMember.updateProjectMember(_id, role);
  },
  btkDeleteProjectMember: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.ProjectMember.deleteProjectMember(_id);
  },
};

requireLogin(projectMemberMutations, 'btkAddProjectMembers');
requireLogin(projectMemberMutations, 'btkUpdateProjectMember');
requireLogin(projectMemberMutations, 'btkDeleteProjectMember');
