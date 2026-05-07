import { supplierQueries } from '@/supplier/graphql/resolvers/queries/supplier';
import { productQueries } from '@/product/graphql/resolvers/queries/product';
import { subscriptionQueries } from '@/subscription/graphql/resolvers/queries/mushopSubscription';
import { subscriptionPlanQueries } from '@/subscription/graphql/resolvers/queries/mushopSubscriptionPlan';
import { mushopInvoiceQueries } from '@/subscription/graphql/resolvers/queries/invoices';

export const queries = {
  ...supplierQueries,
  ...productQueries,
  ...subscriptionQueries,
  ...subscriptionPlanQueries,
  ...mushopInvoiceQueries,
};
