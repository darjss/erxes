import { IContext } from '~/connectionResolvers';
import { IProject } from '@/project/@types/project';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const projectMutations = {
  blockCreateProject: async (
    _parent: undefined,
    { name },
    { models }: IContext,
  ) => {
    return models.Project.createProject(name);
  },

  blockUpdateProjectGeneralInfo: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: IProject },
    { models }: IContext,
  ) => {
    return models.Project.updateProject({ _id, input });
  },

  blockPublishProject: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    return models.Project.updateProject({ _id, input: { isPublished: true } });
  },

  blockRemoveProject: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    return models.Project.removeProject(_id);
  },
};

requireLogin(projectMutations, 'blockCreateProject');
requireLogin(projectMutations, 'blockUpdateProjectGeneralInfo');
requireLogin(projectMutations, 'blockPublishProject');
requireLogin(projectMutations, 'blockRemoveProject');
