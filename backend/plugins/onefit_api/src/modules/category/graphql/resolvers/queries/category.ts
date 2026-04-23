import { IContext } from '~/connectionResolvers';
import { markResolvers } from 'erxes-api-shared/utils';
import { Resolver } from 'erxes-api-shared/core-types';
import { generateFilter } from '../utils/filters';

export interface ICategoryQueryParams {
  searchValue?: string;
  name?: string;
  parentId?: string;
  isActive?: boolean;
}

export const categoryQueries: Record<string, Resolver> = {
  async oneFitActivityCategories(
    _root: undefined,
    params: ICategoryQueryParams,
    context: IContext,
  ) {
    const { models } = context;
    const filter = generateFilter(params);
    return await models.ActivityCategory.find(filter).lean();
  },

  async oneFitActivityCategoriesCount(
    _root: undefined,
    params: ICategoryQueryParams,
    context: IContext,
  ) {
    const { models } = context;
    const filter = generateFilter(params);
    return models.ActivityCategory.find(filter).countDocuments();
  },

  async oneFitActivityCategory(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    const { models } = context;
    return models.ActivityCategory.findOne({ _id });
  },
};

markResolvers(categoryQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
