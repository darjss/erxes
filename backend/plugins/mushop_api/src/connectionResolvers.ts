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
import { IMushopMembershipDocument } from '@/membership/@types/mushopMembership';
import {
  loadMushopMembershipClass,
  IMushopMembershipModel,
} from '@/membership/db/models/MushopMembership';
import { IMushopMembershipPlanDocument } from '@/membership/@types/mushopMembershipPlan';
import {
  loadMushopMembershipPlanClass,
  IMushopMembershipPlanModel,
} from '@/membership/db/models/MushopMembershipPlan';
import { ICollectiveDocument } from '@/collective/@types/collective';
import {
  loadCollectiveClass,
  ICollectiveModel,
} from '@/collective/db/models/Collective';
import { ICollectivePackageDocument } from '@/collective-package/@types/collectivePackage';
import {
  loadCollectivePackageClass,
  ICollectivePackageModel,
} from '@/collective-package/db/models/CollectivePackage';
import { IOrderDocument } from '@/supplier/@types/order';
import { loadOrderClass, IOrderModel } from '@/supplier/db/models/Order';

export interface IModels {
  Supplier: ISupplierModel;
  Product: IMushopProductModel;
  Membership: IMushopMembershipModel;
  MembershipPlan: IMushopMembershipPlanModel;
  Collective: ICollectiveModel;
  CollectivePackage: ICollectivePackageModel;
  Order: IOrderModel;
}

export interface IContext extends IMainContext {
  models: IModels;
  subdomain: string;
}

export const loadClasses = (
  db: mongoose.Connection,
  _subdomain: string,
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

  models.Product = db.model<
    IMushopProductMushopDocument,
    IMushopProductModel
  >(
    'mushop_products',
    loadMushopProductClass(
      models,
      mushopEventHandlers('products', 'mushop_products'),
    ),
  );

  models.Membership = db.model<
    IMushopMembershipDocument,
    IMushopMembershipModel
  >(
    'mushop_memberships',
    loadMushopMembershipClass(
      models,
      mushopEventHandlers('memberships', 'mushop_memberships'),
    ),
  );

  models.MembershipPlan = db.model<
    IMushopMembershipPlanDocument,
    IMushopMembershipPlanModel
  >(
    'mushop_membership_plans',
    loadMushopMembershipPlanClass(
      models,
      mushopEventHandlers('membership_plans', 'mushop_membership_plans'),
    ),
  );

  models.Collective = db.model<ICollectiveDocument, ICollectiveModel>(
    'mushop_collectives',
    loadCollectiveClass(models),
  );

  models.CollectivePackage = db.model<
    ICollectivePackageDocument,
    ICollectivePackageModel
  >(
    'mushop_collective_packages',
    loadCollectivePackageClass(models),
  );

  models.Order = db.model<IOrderDocument, IOrderModel>(
    'mushop_orders',
    loadOrderClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
