import {
  IActivityType,
  IActivityTypeDocument,
} from '@/activity-type/@types/activityType';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { activityTypeSchema } from '../definitions/activityType';

export interface IActivityTypeModel extends Model<IActivityTypeDocument> {
  createActivityType(doc: IActivityType): Promise<IActivityTypeDocument>;
  updateActivityType(
    _id: string,
    doc: Partial<IActivityType>,
  ): Promise<IActivityTypeDocument>;
  findByProvider(providerId: string): Promise<IActivityTypeDocument[]>;
  removeActivityTypes(ids: string[]): Promise<{ n: number; ok: number }>;
}

export const loadActivityTypeClass = (models: IModels) => {
  class ActivityType {
    public static async createActivityType(doc: IActivityType) {
      return await models.ActivityType.create({
        ...doc,
        createdAt: new Date(),
      });
    }

    public static async updateActivityType(
      _id: string,
      doc: Partial<IActivityType>,
    ) {
      return await models.ActivityType.findOneAndUpdate(
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

    public static async findByProvider(providerId: string) {
      return await models.ActivityType.find({ providerId, isActive: true });
    }

    public static async removeActivityTypes(ids: string[]) {
      return models.ActivityType.deleteMany({ _id: { $in: ids } });
    }
  }

  activityTypeSchema.loadClass(ActivityType);

  return activityTypeSchema;
};

