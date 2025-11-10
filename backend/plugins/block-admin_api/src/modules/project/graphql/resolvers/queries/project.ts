import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const projectQueries = {
  blockGetProject: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    return models.Project.getProject(_id);
  },

  blockGetProjects: async (
    _parent: undefined,
    _args: undefined,
    { models }: IContext,
  ) => {
    return models.Project.getProjects();
  },
};

requireLogin(projectQueries, 'blockGetProject');
requireLogin(projectQueries, 'blockGetProjects');
