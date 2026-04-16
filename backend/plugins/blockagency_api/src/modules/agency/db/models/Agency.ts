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
    reasons?: string[],
    notes?: string,
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
      reasons?: string[],
      notes?: string,
    ) {
      const update: Record<string, unknown> = { verificationStatus: status };

      if (reasons !== undefined) {
        update.rejectionReasons = reasons;
      }

      if (notes !== undefined) {
        update.rejectionNotes = notes;
      }

      return models.BlockAgency.findOneAndUpdate(
        { _id },
        { $set: update },
        { new: true },
      );
    }
  }

  blockAgencySchema.loadClass(BlockAgency);

  return blockAgencySchema;
};
