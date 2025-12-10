import { ICursorPaginateParams, Resolver } from 'erxes-api-shared/core-types';
import {
  cursorPaginate,
  escapeRegExp,
  markResolvers,
} from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { ProviderStatus } from '@/provider/@types/provider';

export interface IProviderQueryParams extends ICursorPaginateParams {
  searchValue?: string;
  status?: string;
  categoryId?: string;
  isActive?: boolean;
}

const generateFilter = async (params: IProviderQueryParams) => {
  const filter: any = {};

  if (params.searchValue) {
    filter.$or = [
      {
        businessName: {
          $regex: `.*${escapeRegExp(params.searchValue)}.*`,
          $options: 'i',
        },
      },
      {
        description: {
          $regex: `.*${escapeRegExp(params.searchValue)}.*`,
          $options: 'i',
        },
      },
      {
        'location.address': {
          $regex: `.*${escapeRegExp(params.searchValue)}.*`,
          $options: 'i',
        },
      },
      {
        'location.city': {
          $regex: `.*${escapeRegExp(params.searchValue)}.*`,
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
    { models }: IContext,
  ) {
    const filter = await generateFilter(params);

    return await cursorPaginate({
      model: models.Provider,
      params,
      query: filter,
    });
  },

  async oneFitProvidersCount(
    _root: undefined,
    params: IProviderQueryParams,
    { models }: IContext,
  ) {
    const filter = await generateFilter(params);
    return models.Provider.find(filter).countDocuments();
  },

  async oneFitProvider(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.Provider.findOne({ _id });
  },
};
markResolvers(providerQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
