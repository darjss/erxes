import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { blockAgencySchema } from '~/modules/agency/db/definitions/agency';
import {
  IBlockAgency,
  IBlockAgencyDocument,
} from '~/modules/agency/@types/agency';

export interface IBlockAgencyModel extends Model<IBlockAgencyDocument> {
  createAgency(input: IBlockAgency): Promise<IBlockAgencyDocument>;
  updateAgency(_id: string, input: IBlockAgency): Promise<IBlockAgencyDocument>;
  updateAgencyVerificationStatus(
    _id: string,
    status: string,
  ): Promise<IBlockAgencyDocument>;
}

export const loadBlockAgencyClass = (models: IModels) => {
  class BlockAgency {
    public static async createAgency(input: IBlockAgency) {
      return models.BlockAgency.create(input);
    }

    public static async updateAgency(_id: string, input: IBlockAgency) {
      return models.BlockAgency.findOneAndUpdate(
        { _id },
        { $set: input },
        { new: true },
      );
    }

    public static async updateAgencyVerificationStatus(
      _id: string,
      status: string,
    ) {
      return models.BlockAgency.findOneAndUpdate(
        { _id },
        { $set: { verificationStatus: status } },
        { new: true },
      );
    }
  }

  blockAgencySchema.loadClass(BlockAgency);

  return blockAgencySchema;
};
