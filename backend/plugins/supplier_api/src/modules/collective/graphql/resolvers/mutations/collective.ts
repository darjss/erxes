import { IContext } from '~/connectionResolvers';
import { ICollective } from '@/collective/@types/collective';
import { requestMessage, sendMessage } from '~/modules/admin/utils';

export interface ICollectivePackageInput {
  name: string;
  description?: string;
  coverImage?: string;
  productIds: string[];
  price?: number;
  status?: string;
}

export const collectiveMutations = {
  collectiveUpdateProfile: async (
    _root: undefined,
    { input }: { input: ICollective },
    { models, user, subdomain }: IContext,
  ) => {
    const collective = await models.Collective.updateCollective(
      user._id,
      input,
    );

    if (collective) {
      await sendMessage({
        subdomain,
        path: 'updateCollective',
        platform: 'mushop',
        payload: {
          entityId: collective._id,
          data: { input, userId: user._id },
        },
      });
    }

    return collective;
  },

  collectivePackageAdd: async (
    _root: undefined,
    { input }: { input: ICollectivePackageInput },
    { subdomain }: IContext,
  ) => {
    const { name, productIds } = input || ({} as ICollectivePackageInput);

    if (!name?.trim()) throw new Error('name is required');
    if (!productIds?.length)
      throw new Error('At least one product is required');

    const response = await requestMessage<{
      success?: boolean;
      package?: any;
      error?: string;
    }>({
      subdomain,
      path: 'collective-package/create',
      platform: 'mushop',
      payload: {
        data: {
          targetSubdomain: subdomain,
          ...input,
        },
      },
    });

    if (!response?.success || !response.package) {
      throw new Error(response?.error || 'Failed to create collective package');
    }

    return response.package;
  },
};
