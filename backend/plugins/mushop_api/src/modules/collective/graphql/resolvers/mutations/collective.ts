import { IContext } from '~/connectionResolvers';
import { ICollective } from '@/collective/@types/collective';
import { syncCollectiveProducts } from '@/collective/utils/syncCollectiveProducts';
import { Resolver } from 'erxes-api-shared/core-types';

export const collectiveMutations: Record<string, Resolver> = {
  mushopCreateCollective: async (
    _root: undefined,
    args: {
      name: string;
      description?: string;
      targetSubdomain: string;
      supplierIds: string[];
    },
    { models, user }: IContext,
  ) => {
    const doc: ICollective = {
      name: args.name,
      description: args.description,
      targetSubdomain: args.targetSubdomain,
      supplierIds: args.supplierIds,
    };

    const collective = await models.Collective.createCollective(
      doc,
      user?._id,
    );

    syncCollectiveProducts({
      models,
      collectiveId: collective._id,
    }).catch((e) => {
      console.error('syncCollectiveProducts failed:', e);
    });

    return collective;
  },

  mushopResyncCollective: async (
    _root: undefined,
    { _id }: { _id: string },
    { models, user }: IContext,
  ) => {
    if (!user) throw new Error('Login required');

    const collective = await models.Collective.getCollective(_id);

    syncCollectiveProducts({ models, collectiveId: collective._id }).catch(
      (e) => {
        console.error('syncCollectiveProducts failed:', e);
      },
    );

    return collective;
  },

  mushopRemoveCollective: async (
    _root: undefined,
    { _id }: { _id: string },
    { models, user }: IContext,
  ) => {
    if (!user) throw new Error('Login required');
    return models.Collective.removeCollective(_id);
  },
};


collectiveMutations.mushopCreateCollective.wrapperConfig = {
  skipPermission: true
};