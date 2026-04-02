import { Model } from 'mongoose';
import { IBlockListing, IBlockListingDocument } from '../../@types/listing';
import { IModels } from '~/connectionResolvers';
import { blockListingSchema } from '../definitions/listing';

export interface IBlockListingModel extends Model<IBlockListingDocument> {
  getListing(_id: string): Promise<IBlockListingDocument>;
  createListing(input: IBlockListing): Promise<IBlockListingDocument>;
  updateListing({
    _id,
    input,
  }: {
    _id: string;
    input: IBlockListing;
  }): Promise<IBlockListingDocument>;
  removeListing(listingId: string): Promise<{ ok: number }>;
}

export const loadBlockListingClass = (models: IModels) => {
  class BlockListing {
    public static async getListing(_id: string) {
      const listing = await models.BlockListing.findById(_id);

      if (!listing) {
        throw new Error('Listing not found');
      }
      return listing;
    }

    public static async createListing(
      input: IBlockListing,
    ): Promise<IBlockListingDocument> {
      return models.BlockListing.create(input);
    }

    public static async updateListing({
      _id,
      input,
    }: {
      _id: string;
      input: IBlockListing;
    }) {
      return models.BlockListing.findByIdAndUpdate(
        _id,
        { $set: { ...input } },
        { new: true },
      );
    }

    public static async removeListing(listingId: string) {
      return models.BlockListing.deleteOne({ _id: listingId });
    }
  }

  blockListingSchema.loadClass(BlockListing);

  return blockListingSchema;
};
