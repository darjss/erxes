import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { inventoryItemSchema } from '@/inventories/db/definitions/inventory';
import {
  IInventoryItem,
  IInventoryItemDocument,
  InventoryQueryParams,
} from '@/inventories/@types/inventory';

const generateFilter = (params: InventoryQueryParams) => {
  const filter: Record<string, any> = {};

  if (params.supplierId) {
    filter.supplierId = params.supplierId;
  }

  if (params.status) {
    filter.status = params.status;
  }

  if (params.isBelowSafeRemainder) {
    filter.$expr = { $lte: ['$quantity', '$safeRemainder'] };
  }

  return filter;
};

export interface IInventoryItemModel extends Model<IInventoryItemDocument> {
  getInventoryItem(_id: string): Promise<IInventoryItemDocument>;
  listInventoryItems(
    params: InventoryQueryParams,
  ): Promise<{ list: IInventoryItemDocument[]; totalCount: number }>;
  listSafeRemainderItems(
    supplierId: string,
  ): Promise<IInventoryItemDocument[]>;
  createInventoryItem(
    supplierId: string,
    doc: IInventoryItem,
  ): Promise<IInventoryItemDocument>;
  updateInventoryItem(
    _id: string,
    supplierId: string,
    doc: Partial<IInventoryItem>,
  ): Promise<IInventoryItemDocument>;
  adjustQuantity(
    _id: string,
    supplierId: string,
    delta: number,
  ): Promise<IInventoryItemDocument>;
  removeInventoryItem(_id: string, supplierId: string): Promise<{ ok?: number }>;
}

export const loadInventoryItemClass = (models: IModels) => {
  class InventoryItem {
    public static async getInventoryItem(_id: string) {
      const item = await models.InventoryItem.findOne({ _id }).lean();
      if (!item) throw new Error('Inventory item not found');
      return item;
    }

    public static async listInventoryItems(params: InventoryQueryParams) {
      const filter = generateFilter(params);
      const [list, totalCount] = await Promise.all([
        models.InventoryItem.find(filter).sort({ createdAt: -1 }).lean(),
        models.InventoryItem.countDocuments(filter),
      ]);
      return { list, totalCount };
    }

    public static async listSafeRemainderItems(supplierId: string) {
      return models.InventoryItem.find({
        supplierId,
        $expr: { $lte: ['$quantity', '$safeRemainder'] },
      })
        .sort({ createdAt: -1 })
        .lean();
    }

    public static async createInventoryItem(
      supplierId: string,
      doc: IInventoryItem,
    ) {
      return models.InventoryItem.create({ ...doc, supplierId });
    }

    public static async updateInventoryItem(
      _id: string,
      supplierId: string,
      doc: Partial<IInventoryItem>,
    ) {
      const item = await models.InventoryItem.findOneAndUpdate(
        { _id, supplierId },
        { $set: doc },
        { new: true },
      );
      if (!item) throw new Error('Inventory item not found');
      return item;
    }

    public static async adjustQuantity(
      _id: string,
      supplierId: string,
      delta: number,
    ) {
      const item = await models.InventoryItem.findOneAndUpdate(
        { _id, supplierId },
        { $inc: { quantity: delta } },
        { new: true },
      );
      if (!item) throw new Error('Inventory item not found');
      return item;
    }

    public static async removeInventoryItem(_id: string, supplierId: string) {
      return models.InventoryItem.deleteOne({ _id, supplierId });
    }
  }

  inventoryItemSchema.loadClass(InventoryItem);

  return inventoryItemSchema;
};
