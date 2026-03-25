import { Model } from 'mongoose';
import { IBlockListing, IBlockListingDocument } from '../../@types/listing';
import { IModels } from '~/connectionResolvers';
import { blockListingSchema } from '../definitions/listing';

export interface IBlockListingModel extends Model<IBlockListingDocument> {
  getListings(_id: string): Promise<IBlockListingDocument>;
  createListing(name: string): Promise<IBlockListingDocument>;
  updateListing({
    _id,
    input,
  }: {
    _id: string;
    input: IBlockListing;
  }): Promise<IBlockListingDocument>;
  removeListing(ListingId: string): Promise<{ ok: number }>;
}

export const loadBlockListingClass = (models: IModels) => {
  class BlockListing {
    public static async getListing(_id: string) {
      const Listing = await models.BlockListing.findById(_id);

      if (!Listing) {
        throw new Error('Listing not found');
      }
      return Listing;
    }

    public static async createListing(
      name: string,
    ): Promise<IBlockListingDocument> {
      const listing = await models.BlockListing.create({ name });

      return listing;
    }

    public static async updateListing(_id: string, input: IBlockListing) {
      return models.BlockListing.findByIdAndUpdate(
        { _id },
        { $set: { ...input } },
        { new: true },
      );
    }

    public static async removeListing(ListingId: string[]) {
      return models.BlockListing.deleteOne({ _id: { $in: ListingId } });
    }
  }

  blockListingSchema.loadClass(BlockListing);

  return blockListingSchema;
};
