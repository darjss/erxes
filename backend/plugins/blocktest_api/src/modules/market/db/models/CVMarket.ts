import { IModels } from '~/connectionResolvers';
import { cvMarketSchema } from '~/modules/market/db/definitions/market';
import { ICVCLient, ICVMarketDocument } from '@/market/@types/market';
import { Model } from 'mongoose';

export interface ICVMarketModel extends Model<ICVMarketDocument> {
  getCVMarket(_id: string): Promise<ICVMarketDocument>;
  getCVMarkets(): Promise<ICVMarketDocument[]>;
  createCVMarket(doc: ICVCLient): Promise<ICVMarketDocument>;
  updateCVMarket(_id: string, doc: ICVCLient): Promise<ICVMarketDocument>;
  removeCVMarket(CVMarketId: string): Promise<{ ok: number }>;
}

export const loadCVMarketClass = (models: IModels) => {
  class CVMarket {
    /**
     * Retrieves CVMarket
     */
    public static async getCVMarket(_id: string) {
      const CVMarket = await models.CVMarket.findOne({ _id }).lean();

      if (!CVMarket) {
        throw new Error('CVMarket not found');
      }

      return CVMarket;
    }

    /**
     * Retrieves all CVMarkets
     */
    public static async getCVMarkets(): Promise<ICVMarketDocument[]> {
      return models.CVMarket.find().lean();
    }

    /**
     * Create a CVMarket
     */
    public static async createCVMarket(
      doc: ICVCLient,
    ): Promise<ICVMarketDocument> {
      return models.CVMarket.create(doc);
    }

    /*
     * Update a CVMarket
     */
    public static async updateCVMarket(_id: string, doc: ICVCLient) {
      return await models.CVMarket.findOneAndUpdate(
        { _id },
        { $set: { ...doc } },
      );
    }

    /**
     * Remove CVMarket
     */
    public static async removeCVMarket(CVMarketId: string[]) {
      return models.CVMarket.deleteOne({ _id: { $in: CVMarketId } });
    }
  }

  cvMarketSchema.loadClass(CVMarket);

  return cvMarketSchema;
};
