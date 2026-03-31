import { createActivity } from '@/activity/utils/createActivity';
import { IBlockDeveloperDocument } from '@/developer/db/@types/developer';
import { developerSchema } from '@/developer/db/definitions/developer';
import { log } from 'console';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { BLOCK_MODULES } from '~/constants';

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

export const loadBlockDeveloperClass = (models: IModels, subdomain: string) => {
  class Developer {
    public static async createDeveloper(input: IBlockDeveloperDocument, userId?: string) {
      return models.Developer.create(input);
    }

    public static async updateDeveloper(
      _id: string,
      input: IBlockDeveloperDocument,
      userId?: string,
    ) {
      const oldDeveloper = await models.Developer.findOne({ _id }).lean();
      
      const updatedDeveloper = await models.Developer.findOneAndUpdate(
        { _id },
        input,
        { new: true },    
      );

      if (userId && updatedDeveloper) {
        await createActivity<IBlockDeveloperDocument>({
          subdomain,
          oldDoc: oldDeveloper || undefined,
          newDoc: updatedDeveloper.toObject(),
          userId,
          contentId: _id,
          module: BLOCK_MODULES.DEVELOPER,
        });
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

