import { IModels } from '~/connectionResolvers';
import { cvClientSchema } from '~/modules/client/db/definitions/client';
import { ICVClient, ICVClientDocument } from '@/client/@types/client';
import { Model } from 'mongoose';

export interface ICVClientModel extends Model<ICVClientDocument> {
  getCVClient(_id: string): Promise<ICVClientDocument>;
  getCVClients(): Promise<ICVClientDocument[]>;
  createCVClient(doc: ICVClient): Promise<ICVClientDocument>;
  updateCVClient(_id: string, doc: ICVClient): Promise<ICVClientDocument>;
  removeCVClient(CVClientId: string): Promise<{ ok: number }>;
}

export const loadCVClientClass = (models: IModels) => {
  class CVClient {
    /**
     * Retrieves CVClient
     */
    public static async getCVClient(_id: string) {
      const CVClient = await models.CVClient.findOne({ _id }).lean();

      if (!CVClient) {
        throw new Error('CVClient not found');
      }

      return CVClient;
    }

    /**
     * Retrieves all CVClients
     */
    public static async getCVClients(): Promise<ICVClientDocument[]> {
      return models.CVClient.find().lean();
    }

    /**
     * Create a CVClient
     */
    public static async createCVClient(
      doc: ICVClient,
    ): Promise<ICVClientDocument> {
      return models.CVClient.create(doc);
    }

    /*
     * Update a CVClient
     */
    public static async updateCVClient(_id: string, doc: ICVClient) {
      return await models.CVClient.findOneAndUpdate(
        { _id },
        { $set: { ...doc } },
      );
    }

    /**
     * Remove CVClient
     */
    public static async removeCVClient(CVClientId: string[]) {
      return models.CVClient.deleteOne({ _id: { $in: CVClientId } });
    }
  }

  cvClientSchema.loadClass(CVClient);

  return cvClientSchema;
};
