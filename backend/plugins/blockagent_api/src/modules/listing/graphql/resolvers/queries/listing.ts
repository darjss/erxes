import { requireLogin } from 'erxes-api-shared/core-modules';
import { IContext } from '~/connectionResolvers';

export const blockListingQueries = {
  blockGetListing: async ({ _id }, { models }: IContext) => {
    return models.BlockListing.getListings(_id);
  },

  blockGetListings: async ({ models }: IContext) => {
    return models.BlockListing.find().lean();
  },
};

requireLogin(blockListingQueries, 'blockGetListing');
requireLogin(blockListingQueries, 'blockGetListings');
