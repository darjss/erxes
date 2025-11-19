import { IBlockDeveloperDocument } from '@/developer/db/@types/developer';
import { developerSchema } from '@/developer/db/definitions/developer';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IBlockDeveloperModel extends Model<IBlockDeveloperDocument> {
  createDeveloper(
    input: IBlockDeveloperDocument,
  ): Promise<IBlockDeveloperDocument>;
  updateDeveloper(
    _id: string,
    input: IBlockDeveloperDocument,
  ): Promise<IBlockDeveloperDocument>;
  updateDeveloperVerificationStatus(
    _id: string,
    status: string,
  ): Promise<IBlockDeveloperDocument>;
}

export const loadBlockDeveloperClass = (models: IModels) => {
  class Developer {
    public static async createDeveloper(input: IBlockDeveloperDocument) {
      return models.Developer.create(input);
    }

    public static async updateDeveloper(
      _id: string,
      input: IBlockDeveloperDocument,
    ) {
      return models.Developer.findOneAndUpdate({ _id }, input, {
        new: true,
      });
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
