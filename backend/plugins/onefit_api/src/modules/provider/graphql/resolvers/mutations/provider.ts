import { IContext } from '~/connectionResolvers';
import { IProvider, ProviderStatus } from '@/provider/@types/provider';
import { validateProviderOwnershipByProvider } from '~/utils/ownershipValidator';

interface IMultilingualInput {
  en?: string | null;
  mn?: string | null;
}

function ensureMultilingualName(name?: IMultilingualInput | null): {
  en: string;
  mn: string;
} {
  if (!name) {
    throw new Error('Name is required');
  }

  const en = (name.en || '').trim();
  const mn = (name.mn || '').trim();

  if (!en || !mn) {
    throw new Error('Both English and Mongolian names are required');
  }

  return { en, mn };
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'unnamed'
  );
}

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

    const instanceId = context.instanceId;

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

  async oneFitCityCreate(
    _root: undefined,
    {
      name,
      code,
      isActive,
    }: {
      name: IMultilingualInput;
      code?: string | null;
      isActive?: boolean | null;
    },
    context: IContext,
  ) {
    const { models } = context;
    const normalized = ensureMultilingualName(name);

    const finalCode = (code || '').trim() || slugify(normalized.en);

    return models.City.create({
      name: normalized,
      code: finalCode,
      isActive: isActive ?? true,
    });
  },

  async oneFitCityUpdate(
    _root: undefined,
    {
      _id,
      name,
      code,
      isActive,
    }: {
      _id: string;
      name?: IMultilingualInput | null;
      code?: string | null;
      isActive?: boolean | null;
    },
    context: IContext,
  ) {
    const { models } = context;
    const update: any = {};

    if (name) {
      const normalized = ensureMultilingualName(name);
      update.name = normalized;
    }

    if (code !== undefined) {
      update.code = (code || '').trim();
    }

    if (isActive !== undefined && isActive !== null) {
      update.isActive = isActive;
    }

    return models.City.findOneAndUpdate(
      { _id },
      { $set: update },
      { new: true },
    );
  },

  async oneFitCityRemove(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    const { models } = context;

    await models.District.deleteMany({ cityId: _id });
    const result = await models.City.deleteOne({ _id });

    return {
      deletedCount: result.deletedCount ?? 0,
    };
  },

  async oneFitDistrictCreate(
    _root: undefined,
    {
      cityId,
      name,
      code,
      isActive,
    }: {
      cityId: string;
      name: IMultilingualInput;
      code?: string | null;
      isActive?: boolean | null;
    },
    context: IContext,
  ) {
    const { models } = context;

    const city = await models.City.findOne({ _id: cityId }).lean();
    if (!city) {
      throw new Error('City not found');
    }

    const normalized = ensureMultilingualName(name);
    const finalCode = (code || '').trim() || slugify(normalized.en);

    return models.District.create({
      cityId,
      name: normalized,
      code: finalCode,
      isActive: isActive ?? true,
    });
  },

  async oneFitDistrictUpdate(
    _root: undefined,
    {
      _id,
      cityId,
      name,
      code,
      isActive,
    }: {
      _id: string;
      cityId?: string | null;
      name?: IMultilingualInput | null;
      code?: string | null;
      isActive?: boolean | null;
    },
    context: IContext,
  ) {
    const { models } = context;
    const update: any = {};

    if (cityId) {
      const city = await models.City.findOne({ _id: cityId }).lean();
      if (!city) {
        throw new Error('City not found');
      }
      update.cityId = cityId;
    }

    if (name) {
      const normalized = ensureMultilingualName(name);
      update.name = normalized;
    }

    if (code !== undefined) {
      update.code = (code || '').trim();
    }

    if (isActive !== undefined && isActive !== null) {
      update.isActive = isActive;
    }

    return models.District.findOneAndUpdate(
      { _id },
      { $set: update },
      { new: true },
    );
  },

  async oneFitDistrictRemove(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    const { models } = context;

    const result = await models.District.deleteOne({ _id });

    return {
      deletedCount: result.deletedCount ?? 0,
    };
  },
};
