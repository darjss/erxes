import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import mongoose from 'mongoose';
import { ScopedEventHandlers } from 'erxes-api-shared/core-modules';
import { IMushopSupplierDocument } from '@/supplier/@types/supplier';
import {
  loadSupplierClass,
  ISupplierModel,
} from '@/supplier/db/models/Supplier';
import { IMushopProductMushopDocument } from '@/product/@types/product';
import {
  loadMushopProductClass,
  IMushopProductModel,
} from '@/product/db/models/Product';
import { ICustomerSubscriptionDocument } from '@/subscription/@types/customerSubscription';
import {
  loadCustomerSubscriptionClass,
  ICustomerSubscriptionModel,
} from '@/subscription/db/models/CustomerSubscription';

export interface IModels {
  Supplier: ISupplierModel;
  MushopProduct: IMushopProductModel;
  CustomerSubscription: ICustomerSubscriptionModel;
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
  const mushopEventHandlers = eventHandlers('mushop');

  models.Supplier = db.model<IMushopSupplierDocument, ISupplierModel>(
    'mushop_suppliers',
    loadSupplierClass(
      models,
      mushopEventHandlers('suppliers', 'mushop_suppliers'),
    ),
  );

  models.MushopProduct = db.model<
    IMushopProductMushopDocument,
    IMushopProductModel
  >(
    'mushop_products',
    loadMushopProductClass(
      models,
      mushopEventHandlers('products', 'mushop_products'),
    ),
  );

  models.CustomerSubscription = db.model<
    ICustomerSubscriptionDocument,
    ICustomerSubscriptionModel
  >('mushop_customer_subscriptions', loadCustomerSubscriptionClass(models));

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
