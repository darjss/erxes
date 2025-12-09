import {
  IActivityCategory,
  IActivityCategoryDocument,
} from '@/category/@types/category';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { activityCategorySchema } from '../definitions/category';

export interface IActivityCategoryModel
  extends Model<IActivityCategoryDocument> {
  createCategory(doc: IActivityCategory): Promise<IActivityCategoryDocument>;
  updateCategory(
    _id: string,
    doc: IActivityCategory,
  ): Promise<IActivityCategoryDocument>;
  removeCategories(ids: string[]): Promise<{ n: number; ok: number }>;
}

export const loadActivityCategoryClass = (models: IModels) => {
  class ActivityCategory {
    public static async createCategory(doc: IActivityCategory) {
      return await models.ActivityCategory.create({
        ...doc,
        createdAt: new Date(),
      });
    }

    public static async updateCategory(
      _id: string,
      doc: IActivityCategory,
    ) {
      return await models.ActivityCategory.findOneAndUpdate(
        { _id },
        {
          $set: {
            ...doc,
            modifiedAt: new Date(),
          },
        },
        { new: true },
      );
    }

    public static async removeCategories(ids: string[]) {
      return models.ActivityCategory.deleteMany({ _id: { $in: ids } });
    }
  }

  activityCategorySchema.loadClass(ActivityCategory);

  return activityCategorySchema;
};

