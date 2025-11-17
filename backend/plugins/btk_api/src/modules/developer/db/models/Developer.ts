import { IBtkDeveloperDocument } from '@/developer/db/@types/developer';
import { developerSchema } from '@/developer/db/definitions/developer';
import { IModels } from '~/connectionResolvers';
import { Model } from 'mongoose';

export interface IBtkDeveloperModel extends Model<IBtkDeveloperDocument> {
  createDeveloper(input: IBtkDeveloperDocument): Promise<IBtkDeveloperDocument>;
  updateDeveloper(
    _id: string,
    input: IBtkDeveloperDocument,
  ): Promise<IBtkDeveloperDocument>;
}

export const loadBtkDeveloperClass = (models: IModels) => {
  class Developer {
    public static async createDeveloper(input: IBtkDeveloperDocument) {
      return models.Developer.create(input);
    }

    public static async updateDeveloper(
      _id: string,
      input: IBtkDeveloperDocument,
    ) {
      return models.Developer.findOneAndUpdate({ _id }, input, {
        new: true,
      });
    }
  }

  developerSchema.loadClass(Developer);

  return developerSchema;
};
