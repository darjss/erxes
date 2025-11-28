
  import { IContext } from '~/connectionResolvers';

  export const blocktestMutations = {
    createBlocktest: async (_parent: undefined, { name }, { models }: IContext) => {
      return models.Blocktest.createBlocktest({name});
    },

    updateBlocktest: async (_parent: undefined, { _id, name }, { models }: IContext) => {
      return models.Blocktest.updateBlocktest(_id, {name});
    },

    removeBlocktest: async (_parent: undefined, { _id }, { models }: IContext) => {
      return models.Blocktest.removeBlocktest(_id);
    },
  };

