import { IContext } from '~/connectionResolvers';
import { IBlockListing } from '~/modules/listing/@types/listing';

export const blockListingMutations = {
  blockCreateListing: async (
    _root: undefined,
    { input }: { input: IBlockListing },
    { models }: IContext,
  ) => {
    return models.BlockListing.createListing(input);
  },

  blockUpdateListingGeneralInfo: async (
    _root: undefined,
    { _id, input }: { _id: string; input: IBlockListing },
    { models }: IContext,
  ) => {
    return models.BlockListing.updateListing({ _id, input });
  },

  blockRemoveListing: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    const listing = await models.BlockListing.findById(_id);

    if (!listing) {
      throw new Error('Listing not found');
    }

    await models.BlockListing.removeListing(_id);

    return listing;
  },
};
