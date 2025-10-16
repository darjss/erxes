import {
  IBlockActivityDocument,
  IBlockActivityUpdate,
} from '@/acitivity/@types/acitivy';

import { IBlockActivity } from '@/acitivity/@types/acitivy';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { activitySchema } from '@/acitivity/db/definitions/activity';

export interface IBlockActivityModel extends Model<IBlockActivityDocument> {
  createActivity(doc: IBlockActivity): Promise<IBlockActivityDocument>;
  updateActivity(
    doc: IBlockActivityUpdate,
  ): Promise<IBlockActivityDocument | null>;
  removeActivity(activityId: string): Promise<IBlockActivityDocument | null>;
}

export const loadBlockActivityClass = (models: IModels) => {
  class BlockActivity {
    public static async createActivity(
      doc: IBlockActivity,
    ): Promise<IBlockActivityDocument> {
      return models.BlockActivity.create(doc);
    }
  }

  activitySchema.loadClass(BlockActivity);

  return activitySchema;
};
