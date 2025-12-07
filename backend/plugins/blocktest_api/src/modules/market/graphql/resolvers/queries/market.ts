import { IContext } from '~/connectionResolvers';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { ICVMarket, ICVMarketDocument } from '@/market/@types/market';
import { ICursorPaginateParams } from 'erxes-api-shared/core-types';

export const cvMarketQueries = {
  getCVMarket: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.CVMarket.getCVMarket(_id);
  },
  getCVMarkets: async (
    _parent: undefined,
    params: ICursorPaginateParams & ICVMarket,
    { models }: IContext,
  ) => {
    return cursorPaginate<ICVMarketDocument>({
      model: models.CVMarket,
      params: {
        ...params,
        orderBy: { createdAt: -1 },
      },
      query: {},
    });
  },
};
