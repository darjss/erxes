import { IBlockDeveloperDocument } from '@/developer/db/@types/developer';
import { developerSchema } from '@/developer/db/definitions/developer';
import { IModels } from '~/connectionResolvers';
import { Model } from 'mongoose';

export interface IBlockDeveloperModel extends Model<IBlockDeveloperDocument> {
  createDeveloper(
    input: IBlockDeveloperDocument,
  ): Promise<IBlockDeveloperDocument>;
  updateDeveloper(
    _id: string,
    input: IBlockDeveloperDocument,
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
  }

  developerSchema.loadClass(Developer);

  return developerSchema;
};
