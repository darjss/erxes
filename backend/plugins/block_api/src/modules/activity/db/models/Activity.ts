import {
  IBlockActivityDocument,
  IBlockActivityUpdate,
} from '~/modules/activity/@types/acitivy';

import { graphqlPubsub } from 'erxes-api-shared/utils';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IBlockActivity } from '~/modules/activity/@types/acitivy';
import { activitySchema } from '~/modules/activity/db/definitions/activity';

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
      const activity = await models.BlockActivity.create(doc);

      await graphqlPubsub.publish(`blockActivityChanged:${doc.contentId}`, {
        blockActivityChanged: {
          type: 'created',
          activity,
        },
      });

      return activity;
    }

    public static async updateActivity(
      doc: IBlockActivityDocument,
    ): Promise<IBlockActivityDocument | null> {
      const { _id, ...rest } = doc;

      const updatedActivity = await models.BlockActivity.findOneAndUpdate(
        { _id },
        { $set: { ...rest } },
        { new: true },
      );

      await graphqlPubsub.publish(`blockActivityChanged:${doc.contentId}`, {
        blockActivityChanged: {
          type: 'updated',
          activity: updatedActivity,
        },
      });

      return updatedActivity;
    }

    public static async removeActivity(
      activityId: string,
    ): Promise<IBlockActivityDocument | null> {
      const deletedActivity = await models.BlockActivity.findOneAndDelete({
        _id: activityId,
      });

      await graphqlPubsub.publish(
        `blockActivityChanged:${deletedActivity?.contentId}`,
        {
          blockActivityChanged: {
            type: 'removed',
            activity: deletedActivity,
          },
        },
      );

      return deletedActivity;
    }
  }

  activitySchema.loadClass(BlockActivity);

  return activitySchema;
};
