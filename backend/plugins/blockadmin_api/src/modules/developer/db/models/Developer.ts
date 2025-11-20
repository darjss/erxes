import {
  IBlockDeveloper,
  IBlockDeveloperDocument,
} from '@/developer/db/@types/developer';
import { developerSchema } from '@/developer/db/definitions/developer';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IBlockDeveloperModel extends Model<IBlockDeveloperDocument> {
  getDeveloper(
    subdomain: string,
    entityId: string,
  ): Promise<IBlockDeveloperDocument>;
  createDeveloper(input: IBlockDeveloper): Promise<IBlockDeveloperDocument>;
  updateDeveloper(
    subdomain: string,
    entityId: string,
    input: IBlockDeveloper,
  ): Promise<IBlockDeveloperDocument>;
  updateDeveloperVerificationStatus(
    subdomain: string,
    entityId: string,
    status: string,
  ): Promise<IBlockDeveloperDocument>;
}

export const loadBlockDeveloperClass = (models: IModels) => {
  class Developer {
    public static async getDeveloper(subdomain: string, entityId: string) {
      const developer = await models.Developer.findOne({
        subdomain,
        entityId,
      }).lean();

      if (!developer) {
        throw new Error('Developer not found');
      }

      return developer;
    }

    public static async createDeveloper(input: IBlockDeveloperDocument) {
      return models.Developer.create(input);
    }

    public static async updateDeveloper(
      subdomain: string,
      entityId: string,
      input: IBlockDeveloperDocument,
    ) {
      const { _id } = await models.Developer.getDeveloper(subdomain, entityId);

      return models.Developer.findOneAndUpdate({ _id }, input, {
        new: true,
      });
    }

    public static async updateDeveloperVerificationStatus(
      subdomain: string,
      entityId: string,
      status: string,
    ) {
      const { _id } = await models.Developer.getDeveloper(subdomain, entityId);

      return models.Developer.findOneAndUpdate(
        { _id },
        { verificationStatus: status },
        {
          new: true,
        },
      );
    }
  }

  developerSchema.loadClass(Developer);

  return developerSchema;
};
