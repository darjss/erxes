import { requireLogin } from 'erxes-api-shared/core-modules';
import { IContext } from '~/connectionResolvers';
import { IProjectQueryParams } from '~/modules/project/@types/project';
import { generateFilter } from '~/modules/project/utils';

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
    params: IProjectQueryParams,
    { models }: IContext,
  ) => {
    const filter = await generateFilter(params, models);

    return await models.Project.find(filter).lean();
  },
};

requireLogin(projectQueries, 'blockAdminGetProject');
requireLogin(projectQueries, 'blockAdminGetProjects');
