import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { supplierSchema } from '@/supplier/db/definitions/supplier';
import {
  ISupplier,
  IMushopSupplierDocument,
  SupplierQueryParams,
} from '@/supplier/@types/supplier';
import { SUPPLIER_VERIFICATION_STATUS } from '~/constants';
import { generateFilter } from '@/supplier/utils';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { ICursorPaginateParams } from 'erxes-api-shared/core-types';

export interface ISupplierModel extends Model<IMushopSupplierDocument> {
  getSupplier(_id: string): Promise<IMushopSupplierDocument>;
  listSuppliers(
    params: SupplierQueryParams & ICursorPaginateParams,
  ): Promise<{
    list: IMushopSupplierDocument[];
    pageInfo: any;
    totalCount: number;
  }>;
  adminUpdateSupplier(
    _id: string,
    doc: ISupplier,
  ): Promise<IMushopSupplierDocument | null>;
  updateVerificationStatus(
    _id: string,
    status: string,
  ): Promise<IMushopSupplierDocument | null>;
  updateTierLevel(
    _id: string,
    tierLevel: number,
  ): Promise<IMushopSupplierDocument | null>;
  removeSupplier(_id: string): Promise<{ ok?: number }>;
}

export const loadSupplierClass = (models: IModels) => {
  class Supplier {
    public static async getSupplier(_id: string) {
      const supplier = await models.Supplier.findOne({ _id }).lean();
      if (!supplier) throw new Error('Supplier not found');
      return supplier;
    }

    public static async listSuppliers(
      params: SupplierQueryParams & ICursorPaginateParams,
    ) {
      const filter = generateFilter(params);
      return cursorPaginate<IMushopSupplierDocument>({
        model: models.Supplier,
        params,
        query: filter,
      });
    }

    public static async adminUpdateSupplier(_id: string, doc: ISupplier) {
      return models.Supplier.findOneAndUpdate(
        { _id },
        { $set: doc },
        { new: true },
      );
    }

    public static async updateVerificationStatus(_id: string, status: string) {
      if (!SUPPLIER_VERIFICATION_STATUS.ALL.includes(status)) {
        throw new Error('Invalid verification status');
      }
      return models.Supplier.findOneAndUpdate(
        { _id },
        { $set: { verificationStatus: status } },
        { new: true },
      );
    }

    public static async updateTierLevel(_id: string, tierLevel: number) {
      return models.Supplier.findOneAndUpdate(
        { _id },
        { $set: { tierLevel } },
        { new: true },
      );
    }

    public static async removeSupplier(_id: string) {
      return models.Supplier.deleteOne({ _id });
    }
  }

  supplierSchema.loadClass(Supplier);

  return supplierSchema;
};
