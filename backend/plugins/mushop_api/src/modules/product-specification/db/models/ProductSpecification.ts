import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { mushopProductSpecificationSchema } from '@/product-specification/db/definitions/productSpecification';
import {
  IMushopProductSpecification,
  IMushopProductSpecificationDocument,
} from '@/product-specification/@types/productSpecification';

export interface IMushopProductSpecificationModel
  extends Model<IMushopProductSpecificationDocument> {
  getByProductId(
    productId: string,
  ): Promise<IMushopProductSpecificationDocument | null>;
  save(
    productId: string,
    doc: Omit<IMushopProductSpecification, 'productId'>,
  ): Promise<IMushopProductSpecificationDocument>;
}

export const loadMushopProductSpecificationClass = (models: IModels) => {
  class MushopProductSpecification {
    public static async getByProductId(productId: string) {
      return models.ProductSpecification.findOne({ productId }).lean();
    }

    public static async save(
      productId: string,
      doc: Omit<IMushopProductSpecification, 'productId'>,
    ) {
      return models.ProductSpecification.findOneAndUpdate(
        { productId },
        { $set: { ...doc }, $setOnInsert: { productId } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
  }

  mushopProductSpecificationSchema.loadClass(MushopProductSpecification);

  return mushopProductSpecificationSchema;
};
