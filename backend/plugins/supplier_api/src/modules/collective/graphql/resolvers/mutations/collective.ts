import { IContext } from '~/connectionResolvers';
import { ISupplier } from '@/supplier/@types/supplier';
import { sendMessage } from '~/modules/admin/utils';

export const collectiveMutations = {
  collectiveUpdateProfile: async (
    _root: undefined,
    { input }: { input: ISupplier },
    { models, user, subdomain }: IContext,
  ) => {
    if (!user) throw new Error('Login required');

    const collective = await models.Supplier.updateSupplier(user._id, input);

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
};
