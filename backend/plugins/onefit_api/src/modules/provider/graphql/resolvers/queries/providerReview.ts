import { ICursorPaginateParams, Resolver } from 'erxes-api-shared/core-types';
import { markResolvers, cursorPaginate } from 'erxes-api-shared/utils';
import { SortOrder } from 'mongoose';
import { IContext } from '~/connectionResolvers';

export interface IProviderReviewQueryParams extends ICursorPaginateParams {
  providerId: string;
}

export const providerReviewQueries: Record<string, Resolver> = {
  async oneFitProviderReviews(
    _root: undefined,
    params: IProviderReviewQueryParams,
    context: IContext,
  ) {
    const { models } = context;
    const { providerId, ...paginationParams } = params;

    if (!providerId) {
      throw new Error('providerId is required');
    }

    const orderBy: Record<string, SortOrder> =
      params.orderBy && Object.keys(params.orderBy).length > 0
        ? params.orderBy
        : { createdAt: 'desc' };

    return await cursorPaginate({
      model: models.ProviderReview,
      params: {
        ...paginationParams,
        orderBy,
      },
      query: { providerId },
    });
  },

  async oneFitProviderReviewSummary(
    _root: undefined,
    { providerId }: { providerId: string },
    context: IContext,
  ) {
    const { models } = context;
    return models.ProviderReview.getSummaryForProvider(providerId);
  },
};

markResolvers(providerReviewQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
