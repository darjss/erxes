import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const newsQueries = {
  btkGetNews: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.News.getNews(_id);
  },

  btkGetAllNews: async (
    _parent: undefined,
    _args: undefined,
    { models }: IContext,
  ) => {
    return models.News.getAllNews();
  },
};

requireLogin(newsQueries, 'btkGetNews');
requireLogin(newsQueries, 'btkGetAllNews');
