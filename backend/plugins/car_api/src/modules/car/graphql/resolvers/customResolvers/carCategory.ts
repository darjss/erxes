import { IContext } from '~/connectionResolvers';
import { ICarCategoryDocument } from '~/modules/car/@types/car';

export const CarCategory = {
  isRoot: (category: ICarCategoryDocument) => !category.parentId,
  carCount: async (
    category: ICarCategoryDocument,
    _args,
    { models }: IContext,
  ) => {
    return await models.Cars.countDocuments({
      categoryId: category._id,
      status: { $ne: 'Deleted' },
    });
  },
};
