import { requireLogin } from 'erxes-api-shared/core-modules';
import { IContext } from '~/connectionResolvers';
import { IBlockListing } from '~/modules/listing/@types/listing';

export const blockListingMutations = {
  blockCreateListing: async (
    { name }: { name: string },
    { models }: IContext,
  ) => {
    return models.BlockListing.createListing(name);
  },

  blockUpdateListingGeneralInfo: async (
    { _id, input }: { _id: string; input: IBlockListing },
    { models }: IContext,
  ) => {
    return models.BlockListing.updateListing({ _id, input });
  },

  blockRemoveListing: async (
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.BlockListing.removeListing(_id);
  },
};

requireLogin(blockListingMutations, 'blockCreateListing');
requireLogin(blockListingMutations, 'blockUpdateListingGeneralInfo');
requireLogin(blockListingMutations, 'blockRemoveListing');
