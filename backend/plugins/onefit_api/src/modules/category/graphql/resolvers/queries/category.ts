import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { cursorPaginate, escapeRegExp } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { markResolvers } from 'erxes-api-shared/utils';
import { Resolver } from 'erxes-api-shared/core-types';

export interface ICategoryQueryParams extends ICursorPaginateParams {
  searchValue?: string;
  name?: string;
  parentId?: string;
  isActive?: boolean;
}

const generateFilter = async (params: ICategoryQueryParams) => {
  const filter: any = {};
  const orConditions: any[] = [];

  if (params.searchValue) {
    const searchRegex = {
      $regex: `.*${escapeRegExp(params.searchValue)}.*`,
      $options: 'i',
    };
    orConditions.push(
      { 'name.en': searchRegex },
      { 'name.mn': searchRegex },
      { 'description.en': searchRegex },
      { 'description.mn': searchRegex },
    );
  }

  if (params.name) {
    orConditions.push({ 'name.en': params.name }, { 'name.mn': params.name });
  }

  if (orConditions.length > 0) {
    filter.$or = orConditions;
  }

  if (params.parentId !== undefined) {
    if (params.parentId === null || params.parentId === '') {
      const parentIdOr = [
        { parentId: { $exists: false } },
        { parentId: null },
        { parentId: '' },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: parentIdOr }];
        delete filter.$or;
      } else {
        filter.$or = parentIdOr;
      }
    } else {
      filter.parentId = params.parentId;
    }
  }

  if (params.isActive !== undefined) {
    filter.isActive = params.isActive;
  }

  return filter;
};

export const categoryQueries: Record<string, Resolver> = {
  async oneFitActivityCategories(
    _root: undefined,
    params: ICategoryQueryParams,
    { models }: IContext,
  ) {
    const filter = await generateFilter(params);
    return await cursorPaginate({
      model: models.ActivityCategory,
      params,
      query: filter,
    });
  },

  async oneFitActivityCategoriesCount(
    _root: undefined,
    params: ICategoryQueryParams,
    { models }: IContext,
  ) {
    const filter = await generateFilter(params);
    return models.ActivityCategory.find(filter).countDocuments();
  },

  async oneFitActivityCategory(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.ActivityCategory.findOne({ _id });
  },
};

markResolvers(categoryQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
