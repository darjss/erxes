
  import { IContext } from '~/connectionResolvers';

   export const blocktestQueries = {
    getBlocktest: async (_parent: undefined, { _id }, { models }: IContext) => {
      return models.Blocktest.getBlocktest(_id);
    },
    
    getBlocktests: async (_parent: undefined, { models }: IContext) => {
      return models.Blocktest.getBlocktests();
    },
  };
