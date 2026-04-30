import { IContext } from '~/connectionResolvers';

export const newsQueries = {
  btkGetNews: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.News.getNews(_id);
  },

  btkGetAllNews: async (
    _parent: undefined,
    _args: undefined,
    { models }: IContext,
  ) => {
    return models.News.find({ verificationStatus: 'approved' }).lean();
  },
};
