import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { mushopProductSchema } from '@/product/db/definitions/product';
import {
  IMushopProduct,
  IMushopProductMushopDocument,
  ProductQueryParams,
} from '@/product/@types/product';

export interface IMushopProductModel
  extends Model<IMushopProductMushopDocument> {
  syncProduct(
    subdomain: string,
    entityId: string,
    doc: IMushopProduct,
  ): Promise<IMushopProductMushopDocument>;
  listProducts(params: ProductQueryParams): Promise<{
    list: IMushopProductMushopDocument[];
    totalCount: number;
  }>;
  getProduct(_id: string): Promise<IMushopProductMushopDocument>;
  assignCategory(
    _id: string,
    mushopCategoryId: string | null,
  ): Promise<IMushopProductMushopDocument>;
}

export const loadMushopProductClass = (models: IModels) => {
  class MushopProduct {
    public static async syncProduct(
      subdomain: string,
      entityId: string,
      doc: IMushopProduct,
    ) {
      return models.MushopProduct.findOneAndUpdate(
        { subdomain, entityId },
        {
          $set: { ...doc },
          $setOnInsert: { subdomain, entityId },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    public static async listProducts(params: ProductQueryParams) {
      const {
        supplierId,
        categoryId,
        status,
        searchValue,
        page = 1,
        perPage = 20,
      } = params;
      const filter: any = {};

      if (supplierId) filter.vendorId = supplierId;
      if (categoryId) filter.categoryId = categoryId;
      if (status) filter.status = status;
      if (searchValue) {
        filter.$or = [
          { name: { $regex: searchValue, $options: 'i' } },
          { code: { $regex: searchValue, $options: 'i' } },
        ];
      }

      const list = await models.MushopProduct.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .lean();

      const totalCount = await models.MushopProduct.countDocuments(filter);

      return { list, totalCount };
    }

    public static async getProduct(_id: string) {
      const product = await models.MushopProduct.findOne({ _id }).lean();
      if (!product) throw new Error('Product not found');
      return product;
    }

    public static async assignCategory(
      _id: string,
      mushopCategoryId: string | null,
    ) {
      const product = await models.MushopProduct.findOneAndUpdate(
        { _id },
        { $set: { mushopCategoryId: mushopCategoryId || null } },
        { new: true },
      );
      if (!product) throw new Error('Product not found');
      return product;
    }
  }

  mushopProductSchema.loadClass(MushopProduct);

  return mushopProductSchema;
};
