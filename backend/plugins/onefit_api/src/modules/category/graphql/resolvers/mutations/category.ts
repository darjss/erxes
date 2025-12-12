import { IContext } from '~/connectionResolvers';
import { IActivityCategory } from '@/category/@types/category';
import { markResolvers } from 'erxes-api-shared/utils';

export const categoryMutations = {
  async oneFitActivityCategoryCreate(
    _root: undefined,
    doc: IActivityCategory,
    { models }: IContext,
  ) {
    return await models.ActivityCategory.createCategory({
      ...doc,
      isActive: doc.isActive ?? true,
    });
  },

  async oneFitActivityCategoryUpdate(
    _root: undefined,
    { _id, ...doc }: { _id: string } & IActivityCategory,
    { models }: IContext,
  ) {
    return await models.ActivityCategory.updateCategory(_id, { ...doc });
  },

  async oneFitActivityCategoriesRemove(
    _root: undefined,
    { ids }: { ids: string[] },
    { models }: IContext,
  ) {
    return await models.ActivityCategory.removeCategories(ids);
  },
};
