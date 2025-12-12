import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { markResolvers } from 'erxes-api-shared/utils';
import { Resolver } from 'erxes-api-shared/core-types';
import { generateFilter } from '../utils/filters';

export interface ICategoryQueryParams extends ICursorPaginateParams {
  searchValue?: string;
  name?: string;
  parentId?: string;
  isActive?: boolean;
}

export const categoryQueries: Record<string, Resolver> = {
  async oneFitActivityCategories(
    _root: undefined,
    params: ICategoryQueryParams,
    { models }: IContext,
  ) {
    const filter = generateFilter(params);
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
    const filter = generateFilter(params);
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
