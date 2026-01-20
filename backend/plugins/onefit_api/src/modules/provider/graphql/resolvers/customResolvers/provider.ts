import { IProviderDocument } from '@/provider/@types/provider';
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
  },
};

export default providerCustomResolvers;
