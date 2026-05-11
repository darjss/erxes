import { Model } from 'mongoose';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { IModels } from '~/connectionResolvers';
import { collectiveSchema } from '@/collective/db/definitions/collective';
import {
  COLLECTIVE_STATUS,
  CollectiveQueryParams,
  ICollective,
  ICollectiveDocument,
  ICollectiveSupplierSyncResult,
} from '@/collective/@types/collective';

export interface ICollectiveModel extends Model<ICollectiveDocument> {
  getCollective(_id: string): Promise<ICollectiveDocument>;
  listCollectives(
    params: CollectiveQueryParams & ICursorPaginateParams,
  ): Promise<{
    list: ICollectiveDocument[];
    pageInfo: any;
    totalCount: number;
  }>;
  createCollective(
    doc: ICollective,
    createdBy?: string,
  ): Promise<ICollectiveDocument>;
  updateSyncProgress(
    _id: string,
    update: {
      status?: string;
      syncResults?: ICollectiveSupplierSyncResult[];
      totalCreated?: number;
      totalFailed?: number;
      lastSyncedAt?: Date;
    },
  ): Promise<ICollectiveDocument | null>;
  removeCollective(_id: string): Promise<{ ok?: number }>;
}

export const loadCollectiveClass = (models: IModels) => {
  class Collective {
    public static async getCollective(_id: string) {
      const collective = await models.Collective.findOne({ _id }).lean();
      if (!collective) throw new Error('Collective not found');
      return collective;
    }

    public static async listCollectives(
      params: CollectiveQueryParams & ICursorPaginateParams,
    ) {
      const { searchValue, status, targetSubdomain, supplierId } = params;
      const filter: any = {};

      if (status) filter.status = status;
      if (targetSubdomain) filter.targetSubdomain = targetSubdomain;
      if (supplierId) filter.supplierIds = supplierId;
      if (searchValue) {
        filter.$or = [
          { name: { $regex: searchValue, $options: 'i' } },
          { targetSubdomain: { $regex: searchValue, $options: 'i' } },
        ];
      }

      return cursorPaginate<ICollectiveDocument>({
        model: models.Collective,
        params,
        query: filter,
      });
    }

    public static async createCollective(doc: ICollective, createdBy?: string) {
      if (!doc.name?.trim()) {
        throw new Error('Name is required');
      }
      if (!doc.targetSubdomain?.trim()) {
        throw new Error('targetSubdomain is required');
      }
      if (!doc.supplierIds?.length) {
        throw new Error('At least one supplier is required');
      }

      const suppliers = await models.Supplier.find({
        _id: { $in: doc.supplierIds },
      }).lean();
      if (suppliers.length !== doc.supplierIds.length) {
        throw new Error('One or more suppliers not found');
      }

      const existing = await models.Collective.findOne({
        targetSubdomain: doc.targetSubdomain,
      }).lean();
      if (existing) {
        throw new Error(
          `Collective for subdomain "${doc.targetSubdomain}" already exists`,
        );
      }

      return models.Collective.create({
        ...doc,
        status: COLLECTIVE_STATUS.PENDING,
        createdBy,
      });
    }

    public static async updateSyncProgress(
      _id: string,
      update: {
        status?: string;
        syncResults?: ICollectiveSupplierSyncResult[];
        totalCreated?: number;
        totalFailed?: number;
        lastSyncedAt?: Date;
      },
    ) {
      return models.Collective.findOneAndUpdate(
        { _id },
        { $set: update },
        { new: true },
      );
    }

    public static async removeCollective(_id: string) {
      return models.Collective.deleteOne({ _id });
    }
  }

  collectiveSchema.loadClass(Collective);

  return collectiveSchema;
};
