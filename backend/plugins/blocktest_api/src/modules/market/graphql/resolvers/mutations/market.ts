import { IContext } from '~/connectionResolvers';

export const cvMarketMutations = {
  createCVMarket: async (
    _parent: undefined,
    { name },
    { models }: IContext,
  ) => {
    return models.CVMarket.createCVMarket({ name });
  },

  updateCVMarket: async (
    _parent: undefined,
    { _id, name },
    { models }: IContext,
  ) => {
    return models.CVMarket.updateCVMarket(_id, { name });
  },

  removeCVMarket: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.CVMarket.removeCVMarket(_id);
  },
};
