import { IModels } from '~/connectionResolvers';
import { cvClientSchema } from '~/modules/client/db/definitions/client';
import { ICVClient, ICVClientDocument } from '@/client/@types/client';
import { Model } from 'mongoose';

export interface ICVClientModel extends Model<ICVClientDocument> {
  cvGetClient(_id: string): Promise<ICVClientDocument>;
  cvGetClients(): Promise<ICVClientDocument[]>;
  cvCreateClient(doc: ICVClient): Promise<ICVClientDocument>;
  cvUpdateClient(_id: string, doc: ICVClient): Promise<ICVClientDocument>;
  cvRemoveClient(CVClientId: string): Promise<{ ok: number }>;
}

export const loadCVClientClass = (models: IModels) => {
  class CVClient {
    /**
     * Retrieves CVClient
     */
    public static async cvGetClient(_id: string) {
      const CVClient = await models.CVClient.findOne({ _id }).lean();

      if (!CVClient) {
        throw new Error('CVClient not found');
      }

      return CVClient;
    }

    /**
     * Retrieves all CVClients
     */
    public static async cvGetClients(): Promise<ICVClientDocument[]> {
      return models.CVClient.find().lean();
    }

    /**
     * Create a CVClient
     */
    public static async cvCreateClient(
      doc: ICVClient,
    ): Promise<ICVClientDocument> {
      return models.CVClient.create(doc);
    }

    /*
     * Update a CVClient
     */
    public static async cvUpdateClient(_id: string, doc: ICVClient) {
      return await models.CVClient.findOneAndUpdate(
        { _id },
        { $set: { ...doc } },
      );
    }

    /**
     * Remove CVClient
     */
    public static async cvRemoveClient(CVClientId: string[]) {
      return models.CVClient.deleteOne({ _id: { $in: CVClientId } });
    }
  }

  cvClientSchema.loadClass(CVClient);

  return cvClientSchema;
};
