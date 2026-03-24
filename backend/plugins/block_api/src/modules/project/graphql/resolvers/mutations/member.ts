import { IContext } from '~/connectionResolvers';

export const projectMemberMutations = {
  blockAddProjectMembers: async (
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

  blockUpdateProjectMember: async (
    _parent: undefined,
    { _id, role }: { _id: string; role: string },
    { models }: IContext,
  ) => {
    return models.ProjectMember.updateProjectMember(_id, role);
  },
  blockDeleteProjectMember: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.ProjectMember.deleteProjectMember(_id);
  },
};

