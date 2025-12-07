import { IContext } from '~/connectionResolvers';

export const cvMarketQueries = {
  getCVMarket: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.CVMarket.getCVMarket(_id);
  },

  getCVMarkets: async (_parent: undefined, { models }: IContext) => {
    return models.CVMarket.getCVMarkets();
  },
};
