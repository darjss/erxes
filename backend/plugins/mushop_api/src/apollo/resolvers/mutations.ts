import { supplierMutations } from '@/supplier/graphql/resolvers/mutations/supplier';
import { productMutations } from '@/product/graphql/resolvers/mutations/product';
import { subscriptionMutations } from '@/subscription/graphql/resolvers/mutations/customerSubscription';

export const mutations = {
  ...supplierMutations,
  ...productMutations,
  ...subscriptionMutations,
};
