import { IContext } from '~/connectionResolvers';
import { syncCollectiveProducts } from '@/collective/utils/syncCollectiveProducts';
import { provisionCollectivePos } from '@/collective/utils/provisionCollectivePos';
import { Resolver } from 'erxes-api-shared/core-types';
import { COLLECTIVE_STATUS } from '~/modules/collective/@types/collective';

export const collectiveMutations: Record<string, Resolver> = {
  mushopCreateCollective: async (
    _root: undefined,
    {
      targetSubdomain,
      supplierIds,
    }: {
      targetSubdomain: string;
      supplierIds: string[];
    },
    { models }: IContext,
  ) => {
    const pos = await provisionCollectivePos({ targetSubdomain });

    const collective = await models.Collective.createCollective({
      targetSubdomain,
      targetPosToken: pos.token,
      supplierIds,
    });

    try {
      syncCollectiveProducts({
        models,
        collectiveId: collective._id,
      });
    } catch (error) {
      models.Collective.updateSyncProgress(collective._id, {
        status: COLLECTIVE_STATUS.FAILED,
      });

      throw new Error(
        `Failed to sync collective products: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    return collective;
  },

  mushopResyncCollective: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    const collective = await models.Collective.getCollective(_id);

    try {
      syncCollectiveProducts({ models, collectiveId: collective._id });
    } catch (error) {
      models.Collective.updateSyncProgress(collective._id, {
        status: COLLECTIVE_STATUS.FAILED,
      });

      throw new Error(
        `Failed to sync collective products: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    return collective;
  },

  mushopRemoveCollective: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Collective.removeCollective(_id);
  },
};

collectiveMutations.mushopCreateCollective.wrapperConfig = {
  skipPermission: true,
};

collectiveMutations.mushopResyncCollective.wrapperConfig = {
  skipPermission: true,
};
