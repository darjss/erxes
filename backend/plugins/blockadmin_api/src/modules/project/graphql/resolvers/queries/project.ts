import { requireLogin } from 'erxes-api-shared/core-modules';
import { IContext } from '~/connectionResolvers';

export const projectQueries = {
  blockAdminGetProject: async (
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

  blockAdminGetProjects: async (
    _parent: undefined,
    _args: undefined,
    { models }: IContext,
  ) => {
    return models.Project.find({}).lean();
  },
};

requireLogin(projectQueries, 'blockAdminGetProject');
requireLogin(projectQueries, 'blockAdminGetProjects');
