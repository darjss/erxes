import { IContext } from '~/connectionResolvers';
import { IProvider, ProviderStatus } from '@/provider/@types/provider';
import {
  validateProviderOwnershipByProvider,
  ensureInstanceId,
} from '~/utils/ownershipValidator';

export const providerMutations = {
  async oneFitProviderCreate(
    _root: undefined,
    doc: IProvider,
    context: IContext,
  ) {
    const { models } = context;

    if (doc.categoryIds && doc.categoryIds.length > 0) {
      const categories = await models.ActivityCategory.find({
        _id: { $in: doc.categoryIds },
      });

      if (categories.length !== doc.categoryIds.length) {
        throw new Error('One or more category IDs are invalid');
      }
    }

    const instanceId = ensureInstanceId(context);

    return await models.Provider.createProvider({
      ...doc,
      status: ProviderStatus.PENDING,
      isActive: doc.isActive ?? true,
      instanceId,
    });
  },

  async oneFitProviderUpdate(
    _root: undefined,
    { _id, ...doc }: { _id: string } & Partial<IProvider>,
    context: IContext,
  ) {
    const { models } = context;
    const provider = await models.Provider.findOne({ _id });

    if (!provider) {
      throw new Error('Provider not found');
    }

    validateProviderOwnershipByProvider(context, provider);

    if (provider.status === ProviderStatus.REJECTED) {
      throw new Error('Cannot update a rejected provider');
    }

    if (doc.categoryIds && doc.categoryIds.length > 0) {
      const categories = await models.ActivityCategory.find({
        _id: { $in: doc.categoryIds },
      });

      if (categories.length !== doc.categoryIds.length) {
        throw new Error('One or more category IDs are invalid');
      }
    }

    return await models.Provider.updateProvider(_id, { ...doc });
  },

  async oneFitProviderApprove(
    _root: undefined,
    { _id, approvedBy }: { _id: string; approvedBy: string },
    context: IContext,
  ) {
    const { models } = context;
    const provider = await models.Provider.findOne({ _id });

    if (!provider) {
      throw new Error('Provider not found');
    }

    validateProviderOwnershipByProvider(context, provider);

    if (provider.status === ProviderStatus.APPROVED) {
      throw new Error('Provider is already approved');
    }

    return await models.Provider.approveProvider(_id, approvedBy);
  },

  async oneFitProviderReject(
    _root: undefined,
    {
      _id,
      rejectionReason,
      rejectedBy,
    }: { _id: string; rejectionReason: string; rejectedBy: string },
    context: IContext,
  ) {
    const { models } = context;
    const provider = await models.Provider.findOne({ _id });

    if (!provider) {
      throw new Error('Provider not found');
    }

    validateProviderOwnershipByProvider(context, provider);

    if (provider.status === ProviderStatus.REJECTED) {
      throw new Error('Provider is already rejected');
    }

    return await models.Provider.rejectProvider(
      _id,
      rejectionReason,
      rejectedBy,
    );
  },

  async oneFitProvidersRemove(
    _root: undefined,
    { ids }: { ids: string[] },
    context: IContext,
  ) {
    const { models } = context;

    if (ids && ids.length > 0) {
      const providers = await models.Provider.find({ _id: { $in: ids } });

      for (const provider of providers) {
        validateProviderOwnershipByProvider(context, provider);
      }
    }

    return await models.Provider.removeProviders(ids);
  },
};
