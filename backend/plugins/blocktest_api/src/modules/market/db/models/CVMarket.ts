import { IModels } from '~/connectionResolvers';
import { cvMarketSchema } from '~/modules/market/db/definitions/market';
import { ICVMarket, ICVMarketDocument } from '@/market/@types/market';
import { Model } from 'mongoose';

export interface ICVMarketModel extends Model<ICVMarketDocument> {
  cvGetMarket(_id: string): Promise<ICVMarketDocument>;
  cvGetMarkets(): Promise<ICVMarketDocument[]>;
  cvCreateMarket(doc: ICVMarket): Promise<ICVMarketDocument>;
  cvUpdateMarket(_id: string, doc: ICVMarket): Promise<ICVMarketDocument>;
  cvRemoveMarket(CVMarketId: string): Promise<{ ok: number }>;
}

export const loadCVMarketClass = (models: IModels) => {
  class CVMarket {
    /**
     * Retrieves CVMarket
     */
    public static async cvGetMarket(_id: string) {
      const CVMarket = await models.CVMarket.findOne({ _id }).lean();

      if (!CVMarket) {
        throw new Error('CVMarket not found');
      }

      return CVMarket;
    }

    /**
     * Retrieves all CVMarkets
     */
    public static async cvGetMarkets(): Promise<ICVMarketDocument[]> {
      return models.CVMarket.find().lean();
    }

    /**
     * Create a CVMarket
     */
    public static async cvCreateMarket(
      doc: ICVMarket,
    ): Promise<ICVMarketDocument> {
      return models.CVMarket.create(doc);
    }

    /*
     * Update a CVMarket
     */
    public static async cvUpdateMarket(_id: string, doc: ICVMarket) {
      return await models.CVMarket.findOneAndUpdate(
        { _id },
        { $set: { ...doc } },
      );
    }

    /**
     * Remove CVMarket
     */
    public static async cvRemoveMarket(CVMarketId: string[]) {
      return models.CVMarket.deleteOne({ _id: { $in: CVMarketId } });
    }
  }

  cvMarketSchema.loadClass(CVMarket);

  return cvMarketSchema;
};
