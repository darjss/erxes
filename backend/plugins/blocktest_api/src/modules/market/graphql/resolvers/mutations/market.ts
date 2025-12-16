import { IContext } from '~/connectionResolvers';
import { ICVMarket } from '@/market/@types/market';

export const cvMarketMutations = {
  cvCreateMarket: async (
    _parent: undefined,
    { input }: { input: ICVMarket },
    { models }: IContext,
  ) => {
    return models.CVMarket.cvCreateMarket(input);
  },

  cvUpdateMarket: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: ICVMarket },
    { models }: IContext,
  ) => {
    return models.CVMarket.cvUpdateMarket(_id, input);
  },

  cvRemoveMarket: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.CVMarket.cvRemoveMarket(_id);
  },
};
