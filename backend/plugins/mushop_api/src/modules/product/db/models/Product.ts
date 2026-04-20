import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { mushopProductSchema } from '@/product/db/definitions/product';
import {
  IMushopProduct,
  IMushopProductMushopDocument,
} from '@/product/@types/product';

export interface IMushopProductModel
  extends Model<IMushopProductMushopDocument> {
  syncProduct(
    subdomain: string,
    entityId: string,
    doc: IMushopProduct,
  ): Promise<IMushopProductMushopDocument>;
  getProduct(_id: string): Promise<IMushopProductMushopDocument>;
  assignCategory(
    _id: string,
    categoryId: string | null,
  ): Promise<IMushopProductMushopDocument>;
  removeProduct(_id: string): Promise<IMushopProductMushopDocument | null>;
}

export const loadMushopProductClass = (models: IModels) => {
  class MushopProduct {
    public static async syncProduct(
      subdomain: string,
      entityId: string,
      doc: IMushopProduct,
    ) {
      const { initialCategory, ...rest } = doc;

      return models.MushopProduct.findOneAndUpdate(
        { subdomain, entityId },
        {
          $set: {
            ...rest,
            ...(initialCategory ? { initialCategory } : {}),
          },
          $setOnInsert: { subdomain, entityId },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    public static async getProduct(_id: string) {
      const product = await models.MushopProduct.findOne({ _id }).lean();
      if (!product) throw new Error('Product not found');
      return product;
    }

    public static async removeProduct(_id: string) {
      const product = await models.MushopProduct.findOne({ _id }).lean();
      if (!product) throw new Error('Product not found');
      await models.MushopProduct.deleteOne({ _id });
      return product;
    }

    public static async assignCategory(_id: string, categoryId: string | null) {
      const product = await models.MushopProduct.findOneAndUpdate(
        { _id },
        {
          $set: {
            categoryId: categoryId || null,
          },
        },
        { new: true },
      );
      if (!product) throw new Error('Product not found');
      return product;
    }
  }

  mushopProductSchema.loadClass(MushopProduct);

  return mushopProductSchema;
};
