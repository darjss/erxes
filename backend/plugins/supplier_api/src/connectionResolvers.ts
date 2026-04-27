import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { ScopedEventHandlers } from 'erxes-api-shared/core-modules';
import mongoose from 'mongoose';

import { ISupplierDocument } from '@/supplier/@types/supplier';
import {
  loadSupplierClass,
  ISupplierModel,
} from '@/supplier/db/models/Supplier';
import { ISubmissionDocument } from '@/platform/@types/submission';
import {
  loadSubmissionClass,
  ISubmissionModel,
} from '@/platform/db/models/Submission';

export interface IModels {
  Supplier: ISupplierModel;
  Submission: ISubmissionModel;
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

  models.Submission = db.model<ISubmissionDocument, ISubmissionModel>(
    'supplier_submissions',
    loadSubmissionClass(
      models,
      supplierEventHandlers('submissions', 'supplier_submissions'),
    ),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
