import { IProjectQueryParams } from '@/project/@types/project';
import { IOffsetPaginateParams } from 'erxes-api-shared/core-types';
import { markResolvers, paginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { generateFilter } from '~/modules/project/utils';

export const cpProjectQueries = {
  cpBlockAdminProject: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    const project = await models.Project.findOne({ _id }).lean();

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  },

  cpBlockAdminProjects: async (
    _parent: undefined,
    params: IProjectQueryParams & IOffsetPaginateParams,
    { models }: IContext,
  ) => {
    const {
      page,
      perPage,
      sortField = 'createdAt',
      sortDirection = 'desc',
    } = params;

    const filter = await generateFilter({ ...params, isPublished: true }, models);

    return await paginate(
      models.Project.find(filter)
        .sort({ [sortField]: sortDirection })
        .lean(),
      { page, perPage },
    );
  },
};

markResolvers(cpProjectQueries, {
  wrapperConfig: {
    forClientPortal: true,
  },
});
