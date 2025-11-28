import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { blocktestSchema } from '@/blocktest/db/definitions/blocktest';
import { IBlocktest, IBlocktestDocument } from '@/blocktest/@types/blocktest';

export interface IBlocktestModel extends Model<IBlocktestDocument> {
  getBlocktest(_id: string): Promise<IBlocktestDocument>;
  getBlocktests(): Promise<IBlocktestDocument[]>;
  createBlocktest(doc: IBlocktest): Promise<IBlocktestDocument>;
  updateBlocktest(_id: string, doc: IBlocktest): Promise<IBlocktestDocument>;
  removeBlocktest(BlocktestId: string): Promise<{  ok: number }>;
}

export const loadBlocktestClass = (models: IModels) => {
  class Blocktest {
    /**
     * Retrieves blocktest
     */
    public static async getBlocktest(_id: string) {
      const Blocktest = await models.Blocktest.findOne({ _id }).lean();

      if (!Blocktest) {
        throw new Error('Blocktest not found');
      }

      return Blocktest;
    }

    /**
     * Retrieves all blocktests
     */
    public static async getBlocktests(): Promise<IBlocktestDocument[]> {
      return models.Blocktest.find().lean();
    }

    /**
     * Create a blocktest
     */
    public static async createBlocktest(doc: IBlocktest): Promise<IBlocktestDocument> {
      return models.Blocktest.create(doc);
    }

    /*
     * Update blocktest
     */
    public static async updateBlocktest(_id: string, doc: IBlocktest) {
      return await models.Blocktest.findOneAndUpdate(
        { _id },
        { $set: { ...doc } },
      );
    }

    /**
     * Remove blocktest
     */
    public static async removeBlocktest(BlocktestId: string[]) {
      return models.Blocktest.deleteOne({ _id: { $in: BlocktestId } });
    }
  }

  blocktestSchema.loadClass(Blocktest);

  return blocktestSchema;
};
