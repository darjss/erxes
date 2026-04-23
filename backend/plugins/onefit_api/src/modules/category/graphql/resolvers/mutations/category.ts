import { IContext } from '~/connectionResolvers';
import { IActivityCategory } from '@/category/@types/category';
import { requirePermission } from '~/utils/onefitPermissionCheck';

export const categoryMutations = {
  async oneFitActivityCategoryCreate(
    _root: undefined,
    doc: IActivityCategory,
    context: IContext,
  ) {
    await requirePermission(context, 'categoryManage');
    const { models } = context;
    return await models.ActivityCategory.createCategory({
      ...doc,
      isActive: doc.isActive ?? true,
    });
  },

  async oneFitActivityCategoryUpdate(
    _root: undefined,
    { _id, ...doc }: { _id: string } & IActivityCategory,
    context: IContext,
  ) {
    await requirePermission(context, 'categoryManage');
    const { models } = context;
    return await models.ActivityCategory.updateCategory(_id, { ...doc });
  },

  async oneFitActivityCategoriesRemove(
    _root: undefined,
    { ids }: { ids: string[] },
    context: IContext,
  ) {
    await requirePermission(context, 'categoryManage');
    const { models } = context;
    return await models.ActivityCategory.removeCategories(ids);
  },
};
