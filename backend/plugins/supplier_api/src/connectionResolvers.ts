import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import mongoose from 'mongoose';

import { ISupplierDocument } from '@/supplier/@types/supplier';
import {
  loadSupplierClass,
  ISupplierModel,
} from '@/supplier/db/models/Supplier';

import { IInventoryItemDocument } from '@/inventories/@types/inventory';
import {
  loadInventoryItemClass,
  IInventoryItemModel,
} from '@/inventories/db/models/Inventory';

export interface IModels {
  Supplier: ISupplierModel;
  InventoryItem: IInventoryItemModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Supplier = db.model<ISupplierDocument, ISupplierModel>(
    'suppliers',
    loadSupplierClass(models),
  );

  models.InventoryItem = db.model<IInventoryItemDocument, IInventoryItemModel>(
    'inventory_items',
    loadInventoryItemClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
