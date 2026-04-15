import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { IBlockAdminListingDocument } from '@/listing/@types/listing';
import { generateFilter } from '@/listing/utils';

interface ListingQueryParams {
  subdomain?: string;
  status?: string;
  searchValue?: string;
  city?: string;
  district?: string;
}

export const listingQueries = {
  getBlockAdminListing: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    const listing = await models.Listing.findById(_id).lean();
    if (!listing) throw new Error('Listing not found');
    return listing;
  },

  getBlockAdminListings: async (
    _root: undefined,
    params: ListingQueryParams & ICursorPaginateParams,
    { models }: IContext,
  ) => {
    const filter = generateFilter(params);

    const { list, pageInfo, totalCount } =
      await cursorPaginate<IBlockAdminListingDocument>({
        model: models.Listing,
        params,
        query: filter,
      });

    return { list, pageInfo, totalCount };
  },

  getBlockAdminListingStats: async (
    _root: undefined,
    { subdomain }: { subdomain?: string },
    { models }: IContext,
  ) => {
    const baseFilter = subdomain ? { subdomain } : {};

    const [total, active, draft, viewsAgg] = await Promise.all([
      models.Listing.countDocuments(baseFilter),
      models.Listing.countDocuments({ ...baseFilter, status: 'active' }),
      models.Listing.countDocuments({ ...baseFilter, status: 'draft' }),
      models.Listing.aggregate([
        ...(subdomain ? [{ $match: { subdomain } }] : []),
        { $group: { _id: null, totalViews: { $sum: '$viewCount' } } },
      ]),
    ]);

    return {
      total,
      active,
      draft,
      totalViews: viewsAgg[0]?.totalViews ?? 0,
    };
  },
};
