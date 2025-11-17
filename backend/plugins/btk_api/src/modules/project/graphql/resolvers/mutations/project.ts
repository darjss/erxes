import { IContext } from '~/connectionResolvers';
import { IProject } from '@/project/@types/project';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const projectMutations = {
  btkCreateProject: async (
    _parent: undefined,
    { name },
    { models }: IContext,
  ) => {
    return models.Project.createProject(name);
  },

  btkUpdateProjectGeneralInfo: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: IProject },
    { models }: IContext,
  ) => {
    return models.Project.updateProject({ _id, input });
  },

  btkPublishProject: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    return models.Project.updateProject({ _id, input: { isPublished: true } });
  },

  btkRemoveProject: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    return models.Project.removeProject(_id);
  },
};

requireLogin(projectMutations, 'btkCreateProject');
requireLogin(projectMutations, 'btkUpdateProjectGeneralInfo');
requireLogin(projectMutations, 'btkPublishProject');
requireLogin(projectMutations, 'btkRemoveProject');
