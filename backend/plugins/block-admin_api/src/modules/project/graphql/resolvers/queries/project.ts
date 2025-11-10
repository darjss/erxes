import { requireLogin } from 'erxes-api-shared/core-modules';
import { IContext } from '~/connectionResolvers';

export const projectQueries = {
  blockGetProject: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    const project = await models.Project.findOne({ _id }).lean();

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  },

  blockGetProjects: async (
    _parent: undefined,
    _args: undefined,
    { models }: IContext,
  ) => {
    return models.Project.find({}).lean();
  },
};

requireLogin(projectQueries, 'blockGetProject');
requireLogin(projectQueries, 'blockGetProjects');
