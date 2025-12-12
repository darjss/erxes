import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import {
  cursorPaginate,
  escapeRegExp,
  markResolvers,
} from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { GenderRestriction } from '@/activity-type/@types/activityType';

export interface IActivityTypeQueryParams extends ICursorPaginateParams {
  searchValue?: string;
  providerId?: string;
  categoryId?: string;
  genderRestriction?: GenderRestriction;
  isActive?: boolean;
}

const generateFilter = async (params: IActivityTypeQueryParams) => {
  const filter: any = {};

  if (params.searchValue) {
    const searchRegex = {
      $regex: `.*${escapeRegExp(params.searchValue)}.*`,
      $options: 'i',
    };
    filter.$or = [
      { 'name.en': searchRegex },
      { 'name.mn': searchRegex },
      { 'description.en': searchRegex },
      { 'description.mn': searchRegex },
    ];
  }

  if (params.providerId) {
    filter.providerId = params.providerId;
  }

  if (params.categoryId) {
    filter.categoryIds = params.categoryId;
  }

  if (params.genderRestriction) {
    filter.genderRestriction = params.genderRestriction;
  }

  if (params.isActive !== undefined) {
    filter.isActive = params.isActive;
  }

  return filter;
};

export const activityTypeQueries = {
  async oneFitActivityTypes(
    _root: undefined,
    params: IActivityTypeQueryParams,
    { models }: IContext,
  ) {
    const filter = await generateFilter(params);

    return await cursorPaginate({
      model: models.ActivityType,
      params,
      query: filter,
    });
  },

  async oneFitActivityTypesCount(
    _root: undefined,
    params: IActivityTypeQueryParams,
    { models }: IContext,
  ) {
    const filter = await generateFilter(params);
    return models.ActivityType.find(filter).countDocuments();
  },

  async oneFitActivityType(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.ActivityType.findOne({ _id });
  },
};

markResolvers(activityTypeQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
