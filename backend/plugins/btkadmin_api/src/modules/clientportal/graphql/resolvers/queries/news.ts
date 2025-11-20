import { INewsQueryParams } from '~/modules/news/@types/news';
import { IOffsetPaginateParams } from 'erxes-api-shared/core-types';
import { paginate, markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { generateFilter } from '~/modules/news/utils';

export const cpNewsQueries = {
  cpBtkAdminNews: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    const news = await models.News.findOne({ _id }).lean();

    if (!news) {
      throw new Error('News not found');
    }

    return news;
  },

  cpBtkAdminAllNews: async (
    _parent: undefined,
    params: INewsQueryParams & IOffsetPaginateParams,
    { models }: IContext,
  ) => {
    const {
      page,
      perPage,
      sortField = 'createdAt',
      sortDirection = 'desc',
    } = params;

    const filter = await generateFilter(params, models);

    return await paginate(
      models.News.find(filter)
        .sort({ [sortField]: sortDirection })
        .lean(),
      { page, perPage },
    );
  },
};

markResolvers(cpNewsQueries, {
  wrapperConfig: {
    forClientPortal: true,
  },
});
