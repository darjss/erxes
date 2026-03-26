import { IProviderDocument } from '@/provider/@types/provider';
import { IContext } from '~/connectionResolvers';

const providerCustomResolvers = {
  MtoProvider: {
    categories: async (
      provider: IProviderDocument,
      _params: undefined,
      { models }: IContext,
    ) => {
      return [];
    },
  },
};

export default providerCustomResolvers;
