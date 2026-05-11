import { supplierMutations } from '@/supplier/graphql/resolvers/mutations/supplier';
import { productMutations } from '@/product/graphql/resolvers/mutations/product';
import { subscriptionMutations } from '@/subscription/graphql/resolvers/mutations/mushopSubscription';
import { subscriptionPlanMutations } from '@/subscription/graphql/resolvers/mutations/mushopSubscriptionPlan';
import { collectiveMutations } from '@/collective/graphql/resolvers/mutations/collective';

export const mutations = {
  ...supplierMutations,
  ...productMutations,
  ...subscriptionMutations,
  ...subscriptionPlanMutations,
  ...collectiveMutations,
};
