import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const projectQueries = {
  btkGetProject: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Project.getProject(_id);
  },

  btkGetProjects: async (
    _parent: undefined,
    _args: undefined,
    { models }: IContext,
  ) => {
    return models.Project.getProjects();
  },
};

requireLogin(projectQueries, 'btkGetProject');
requireLogin(projectQueries, 'btkGetProjects');
