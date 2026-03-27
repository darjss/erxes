import { IContext } from '~/connectionResolvers';
import { INewsQueryParams } from '~/modules/news/@types/news';
import { generateFilter } from '~/modules/news/utils';

export const newsQueries = {
  btkAdminGetNews: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    const news = await models.News.findOne({ _id }).lean();

    if (!news) {
      throw new Error('News not found');
    }

    return news;
  },

  btkAdminGetAllNews: async (
    _parent: undefined,
    params: INewsQueryParams,
    { models }: IContext,
  ) => {
    const filter = await generateFilter(params, models);

    return await models.News.find(filter).lean();
  },
};
