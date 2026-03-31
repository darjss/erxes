import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { listingSchema } from '../definitions/listing';
import {
  IBlockAdminListing,
  IBlockAdminListingDocument,
} from '../@types/listing';

export interface IBlockAdminListingModel
  extends Model<IBlockAdminListingDocument> {
  getListing(
    subdomain: string,
    entityId: string,
  ): Promise<IBlockAdminListingDocument>;
  createListing(
    input: IBlockAdminListing,
  ): Promise<IBlockAdminListingDocument>;
  updateListing(
    subdomain: string,
    entityId: string,
    input: Partial<IBlockAdminListing>,
  ): Promise<IBlockAdminListingDocument | null>;
  removeListing(subdomain: string, entityId: string): Promise<{ ok: number }>;
}

export const loadBlockAdminListingClass = (models: IModels) => {
  class Listing {
    public static async getListing(subdomain: string, entityId: string) {
      const listing = await models.Listing.findOne({
        subdomain,
        entityId,
      }).lean();

      if (!listing) {
        throw new Error('Listing not found');
      }

      return listing;
    }

    public static async createListing(input: IBlockAdminListingDocument) {
      return models.Listing.create(input);
    }

    public static async updateListing(
      subdomain: string,
      entityId: string,
      input: Partial<IBlockAdminListing>,
    ) {
      return models.Listing.findOneAndUpdate(
        { subdomain, entityId },
        { $set: { ...input } },
        { new: true },
      );
    }

    public static async removeListing(subdomain: string, entityId: string) {
      return models.Listing.deleteOne({ subdomain, entityId });
    }
  }

  listingSchema.loadClass(Listing);

  return listingSchema;
};
