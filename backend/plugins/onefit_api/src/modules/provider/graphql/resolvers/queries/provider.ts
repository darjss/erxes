import { ICursorPaginateParams, Resolver } from 'erxes-api-shared/core-types';
import {
  cursorPaginate,
  escapeRegExp,
  markResolvers,
} from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { ProviderStatus } from '@/provider/@types/provider';
import { isSlaveMode } from '~/constants/mode';

export interface IProviderQueryParams extends ICursorPaginateParams {
  searchValue?: string;
  status?: string;
  categoryId?: string;
  isActive?: boolean;
}

const generateFilter = async (
  params: IProviderQueryParams,
  instanceId?: string,
) => {
  const filter: any = {};

  if (instanceId) {
    filter.instanceId = instanceId;
  }

  if (params.searchValue) {
    const escaped = escapeRegExp(params.searchValue);

    filter.$or = [
      {
        'businessName.en': {
          $regex: `.*${escaped}.*`,
          $options: 'i',
        },
      },
      {
        'businessName.mn': {
          $regex: `.*${escaped}.*`,
          $options: 'i',
        },
      },
      {
        'description.en': {
          $regex: `.*${escaped}.*`,
          $options: 'i',
        },
      },
      {
        'description.mn': {
          $regex: `.*${escaped}.*`,
          $options: 'i',
        },
      },
      {
        'location.address.en': {
          $regex: `.*${escaped}.*`,
          $options: 'i',
        },
      },
      {
        'location.address.mn': {
          $regex: `.*${escaped}.*`,
          $options: 'i',
        },
      },
      {
        'location.city.en': {
          $regex: `.*${escaped}.*`,
          $options: 'i',
        },
      },
      {
        'location.city.mn': {
          $regex: `.*${escaped}.*`,
          $options: 'i',
        },
      },
    ];
  }

  if (params.status) {
    filter.status = params.status;
  }

  if (params.categoryId) {
    filter.categoryIds = params.categoryId;
  }

  if (params.isActive !== undefined) {
    filter.isActive = params.isActive;
  }

  return filter;
};

export const providerQueries: Record<string, Resolver> = {
  async oneFitProviders(
    _root: undefined,
    params: IProviderQueryParams,
    context: IContext,
  ) {
    const { models, mode, instanceId, masterClient } = context;

    const filter = await generateFilter(params, instanceId);
    return await cursorPaginate({
      model: models.Provider,
      params,
      query: filter,
    });
  },

  async oneFitProvidersCount(
    _root: undefined,
    params: IProviderQueryParams,
    context: IContext,
  ) {
    const { models, mode, instanceId, masterClient } = context;

    const filter = await generateFilter(params, instanceId);
    return models.Provider.find(filter).countDocuments();
  },

  async oneFitProvider(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    const { models, mode, instanceId, masterClient } = context;

    const provider = await models.Provider.findOne({ _id });
    if (provider && instanceId && provider.instanceId !== instanceId) {
      return null;
    }
    return provider;
  },
};
markResolvers(providerQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
