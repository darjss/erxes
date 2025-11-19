import { IContext } from '~/connectionResolvers';
import { INews } from '~/modules/news/@types/news';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const newsMutations = {
  btkCreateNews: async (_parent: undefined, { name }, { models }: IContext) => {
    return models.News.createNews(name);
  },

  btkUpdateNewsGeneralInfo: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: INews },
    { models }: IContext,
  ) => {
    return models.News.updateNews({ _id, input });
  },

  btkPublishNews: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.News.updateNews({ _id, input: { isPublished: true } });
  },

  btkRemoveNews: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.News.removeNews(_id);
  },
};

requireLogin(newsMutations, 'btkCreateNews');
requireLogin(newsMutations, 'btkUpdateNewsGeneralInfo');
requireLogin(newsMutations, 'btkPublishNews');
requireLogin(newsMutations, 'btkRemoveNews');
