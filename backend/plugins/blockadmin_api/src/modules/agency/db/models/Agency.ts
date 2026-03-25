import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { agencySchema } from '@/agency/db/definitions/agency';
import {
  IBlockAgency,
  IBlockAgencyDocument,
} from '@/agency/@types/agency';

export interface IBlockAgencyModel extends Model<IBlockAgencyDocument> {
  getAgency(subdomain: string, entityId: string): Promise<IBlockAgencyDocument>;
  createAgency(input: IBlockAgency): Promise<IBlockAgencyDocument>;
  updateAgency(
    subdomain: string,
    entityId: string,
    input: IBlockAgency,
  ): Promise<IBlockAgencyDocument>;
  updateAgencyVerificationStatus(
    subdomain: string,
    entityId: string,
    status: string,
  ): Promise<IBlockAgencyDocument>;
}

export const loadBlockAgencyClass = (models: IModels) => {
  class Agency {
    public static async getAgency(subdomain: string, entityId: string) {
      const agency = await models.Agency.findOne({
        subdomain,
        entityId,
      }).lean();

      if (!agency) {
        throw new Error('Agency not found');
      }

      return agency;
    }

    public static async createAgency(input: IBlockAgencyDocument) {
      return models.Agency.create(input);
    }

    public static async updateAgency(
      subdomain: string,
      entityId: string,
      input: IBlockAgencyDocument,
    ) {
      const { _id } = await models.Agency.getAgency(subdomain, entityId);

      return models.Agency.findOneAndUpdate({ _id }, input, { new: true });
    }

    public static async updateAgencyVerificationStatus(
      subdomain: string,
      entityId: string,
      status: string,
    ) {
      const { _id } = await models.Agency.getAgency(subdomain, entityId);

      return models.Agency.findOneAndUpdate(
        { _id },
        { verificationStatus: status },
        { new: true },
      );
    }
  }

  agencySchema.loadClass(Agency);

  return agencySchema;
};
