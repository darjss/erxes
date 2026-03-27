import { IProviderDocument } from '@/provider/@types/provider';
import { IProviderReviewDocument } from '@/provider/@types/providerReview';
import { IContext } from '~/connectionResolvers';

const providerCustomResolvers = {
  OneFitProvider: {
    categories: async (
      provider: IProviderDocument,
      _params: undefined,
      { models }: IContext,
    ) => {
      if (!provider.categoryIds || provider.categoryIds.length === 0) {
        return [];
      }
      return await models.ActivityCategory.find({
        _id: { $in: provider.categoryIds },
      });
    },

    reviewSummary: async (
      provider: IProviderDocument,
      _params: undefined,
      { models }: IContext,
    ) => {
      if (!provider._id) {
        return { averageRating: 0, reviewCount: 0 };
      }
      return models.ProviderReview.getSummaryForProvider(provider._id);
    },
  },

  OneFitProviderReview: {
    user: async (
      review: IProviderReviewDocument,
      _params: undefined,
      { models }: IContext,
    ) => {
      if (!review.userId) {
        return null;
      }
      return await models.OneFitCustomer.findOne({ _id: review.userId });
    },
  },
};

export default providerCustomResolvers;
