import { IContext } from '~/connectionResolvers';
import { ICVMarket } from '@/market/@types/market';

export const cvMarketMutations = {
  createCVMarket: async (
    _parent: undefined,
    { input }: { input: ICVMarket },
    { models }: IContext,
  ) => {
    return models.CVMarket.createCVMarket(input);
  },

  updateCVMarket: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: ICVMarket },
    { models }: IContext,
  ) => {
    return models.CVMarket.updateCVMarket(_id, input);
  },

  removeCVMarket: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.CVMarket.removeCVMarket(_id);
  },
};
