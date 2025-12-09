import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { cursorPaginate, escapeRegExp } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

export interface ICategoryQueryParams extends ICursorPaginateParams {
  searchValue?: string;
  name?: string;
  parentId?: string;
  isActive?: boolean;
}

const generateFilter = async (params: ICategoryQueryParams) => {
  const filter: any = {};

  if (params.searchValue) {
    filter.$or = [
      {
        name: {
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
    ];
  }

  if (params.name) {
    filter.name = params.name;
  }

  if (params.parentId !== undefined) {
    if (params.parentId === null || params.parentId === '') {
      filter.$or = [
        { parentId: { $exists: false } },
        { parentId: null },
        { parentId: '' },
      ];
    } else {
      filter.parentId = params.parentId;
    }
  }

  if (params.isActive !== undefined) {
    filter.isActive = params.isActive;
  }

  return filter;
};

export const categoryQueries = {
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
