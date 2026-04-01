import { IBlockDeveloperDocument } from '@/developer/db/@types/developer';
import { developerSchema } from '@/developer/db/definitions/developer';
import { EventDispatcherReturn } from 'erxes-api-shared/core-modules';
import { log } from 'console';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { generateDeveloperUpdateActivityLogs } from '../../meta/activity-log';

export interface IBlockDeveloperModel extends Model<IBlockDeveloperDocument> {
  createDeveloper(
    input: IBlockDeveloperDocument,
    userId?: string,
  ): Promise<IBlockDeveloperDocument>;
  updateDeveloper(
    _id: string,
    input: IBlockDeveloperDocument,
    userId?: string,
  ): Promise<IBlockDeveloperDocument>;
  updateDeveloperVerificationStatus(
    _id: string,
    status: string,
  ): Promise<IBlockDeveloperDocument>;
}

export const loadBlockDeveloperClass = (
  models: IModels,
  subdomain: string,
  { createActivityLog }: EventDispatcherReturn,
) => {
  class Developer {
    public static async createDeveloper(input: IBlockDeveloperDocument, userId?: string) {
      return models.Developer.create(input);
    }

    public static async updateDeveloper(
      _id: string,
      input: IBlockDeveloperDocument,
      userId?: string,
    ) {
      const prevDeveloper = await models.Developer.findOne({ _id }).lean();

      const updatedDeveloper = await models.Developer.findOneAndUpdate(
        { _id },
        input,
        { new: true },
      );

      if (prevDeveloper && updatedDeveloper) {
        await generateDeveloperUpdateActivityLogs(
          prevDeveloper,
          updatedDeveloper.toObject(),
          createActivityLog,
        );
      }

      return updatedDeveloper;
    }

    public static async updateDeveloperVerificationStatus(
      _id: string,
      status: string,
    ) {
      return models.Developer.findOneAndUpdate(
        { _id },
        {
          $set: { verificationStatus: status },
        },
        {
          new: true,
        },
      );
    }
  }

  developerSchema.loadClass(Developer);

  return developerSchema;
};

