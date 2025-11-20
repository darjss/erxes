import {
  IBtkActivityDocument,
  IBtkActivityUpdate,
} from '@/acitivity/@types/acitivy';

import { IBtkActivity } from '@/acitivity/@types/acitivy';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { activitySchema } from '@/acitivity/db/definitions/activity';

export interface IBtkActivityModel extends Model<IBtkActivityDocument> {
  createActivity(doc: IBtkActivity): Promise<IBtkActivityDocument>;
  updateActivity(doc: IBtkActivityUpdate): Promise<IBtkActivityDocument | null>;
  removeActivity(activityId: string): Promise<IBtkActivityDocument | null>;
}

export const loadBtkActivityClass = (models: IModels) => {
  class BtkActivity {
    public static async createActivity(
      doc: IBtkActivity,
    ): Promise<IBtkActivityDocument> {
      return models.BtkActivity.create(doc);
    }
  }

  activitySchema.loadClass(BtkActivity);

  return activitySchema;
};
