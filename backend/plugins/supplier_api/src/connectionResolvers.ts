import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { ScopedEventHandlers } from 'erxes-api-shared/core-modules';
import mongoose from 'mongoose';

import { ISupplierDocument } from '@/supplier/@types/supplier';
import {
  loadSupplierClass,
  ISupplierModel,
} from '@/supplier/db/models/Supplier';

export interface IModels {
  Supplier: ISupplierModel;
}

export interface IContext extends IMainContext {
  models: IModels;
  subdomain: string;
}

export const loadClasses = (
  db: mongoose.Connection,
  subdomain: string,
  eventHandlers: ScopedEventHandlers,
): IModels => {
  const models = {} as IModels;
  const supplierEventHandlers = eventHandlers('supplier');

  models.Supplier = db.model<ISupplierDocument, ISupplierModel>(
    'suppliers',
    loadSupplierClass(models, supplierEventHandlers('suppliers', 'suppliers')),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
