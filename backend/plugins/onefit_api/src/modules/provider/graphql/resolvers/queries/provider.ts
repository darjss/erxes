import { ICursorPaginateParams, Resolver } from 'erxes-api-shared/core-types';
import {
  cursorPaginate,
  escapeRegExp,
  markResolvers,
} from 'erxes-api-shared/utils';
import { IContext, IModels } from '~/connectionResolvers';
import { IActivityCategoryModel } from '@/category/db/models/Category';
import { ProviderStatus } from '@/provider/@types/provider';
import { isSlaveMode } from '~/constants/mode';
import {
  geospatialCursorPaginate,
  GeospatialCursorParams,
} from '@/provider/utils/geospatialUtils';

export interface IProviderQueryParams extends ICursorPaginateParams {
  searchValue?: string;
  status?: string;
  categoryId?: string;
  isActive?: boolean;
  hasScheduleFutureOrNow?: boolean;
  near?: { lat: number; lng: number };
  maxDistance?: number;
}

async function getCategoryIdsWithDescendants(
  ActivityCategory: IActivityCategoryModel,
  categoryId: string,
): Promise<string[]> {
  const ids = [categoryId];
  let currentLevel = [categoryId];
  while (currentLevel.length > 0) {
    const children = await ActivityCategory.find(
      { parentId: { $in: currentLevel } },
      { _id: 1 },
    ).lean();
    const childIds = children.map((c) => c._id.toString());
    ids.push(...childIds);
    currentLevel = childIds;
  }
  return ids;
}

const generateFilter = async (
  params: IProviderQueryParams,
  instanceId?: string,
  models?: IModels,
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
    if (models) {
      const categoryIdsToMatch = await getCategoryIdsWithDescendants(
        models.ActivityCategory,
        params.categoryId,
      );
      filter.categoryIds = { $in: categoryIdsToMatch };
    } else {
      filter.categoryIds = params.categoryId;
    }
  }

  if (params.isActive !== undefined) {
    filter.isActive = params.isActive;
  }

  if (params.hasScheduleFutureOrNow && models) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const scheduleFilter = {
      $or: [
        { year: { $gt: currentYear } },
        { year: currentYear, month: { $gte: currentMonth } },
      ],
    };

    const schedules = await models.ScheduleTemplate.find(scheduleFilter, {
      providerId: 1,
    }).lean();
    const providerIds = [...new Set(schedules.map((s) => s.providerId))];
    filter._id = { $in: providerIds };
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

    const filter = await generateFilter(params, instanceId, models);

    // Use geospatial query if near parameter is provided
    if (params.near && params.near.lat && params.near.lng) {
      // Convert orderBy to compatible format if present
      const orderBy = params.orderBy
        ? Object.entries(params.orderBy).reduce((acc, [key, value]) => {
            // Convert SortOrder to 1 | -1 | 'asc' | 'desc'
            if (
              value === 1 ||
              value === -1 ||
              value === 'asc' ||
              value === 'desc'
            ) {
              acc[key] = value as 1 | -1 | 'asc' | 'desc';
            } else if (value === 'ascending') {
              acc[key] = 'asc';
            } else if (value === 'descending') {
              acc[key] = 'desc';
            }
            return acc;
          }, {} as Record<string, 1 | -1 | 'asc' | 'desc'>)
        : undefined;

      const geospatialParams: GeospatialCursorParams = {
        limit: params.limit,
        cursor: params.cursor,
        direction: params.direction,
        orderBy,
      };

      return await geospatialCursorPaginate({
        model: models.Provider,
        near: params.near,
        maxDistance: params.maxDistance,
        filter,
        params: geospatialParams,
      });
    }

    // Otherwise use standard cursor pagination
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

    const filter = await generateFilter(params, instanceId, models);
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
