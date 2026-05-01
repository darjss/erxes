import {
  mutations as SupplierMutations,
  queries as SupplierQueries,
  types as SupplierTypes,
} from '@/supplier/graphql/schemas/supplier';
import {
  mutations as ProductMutations,
  queries as ProductQueries,
  types as ProductTypes,
} from '@/product/graphql/schemas/product';
import {
  mutations as SubscriptionMutations,
  queries as SubscriptionQueries,
  types as SubscriptionTypes,
} from '@/subscription/graphql/schemas/mushopSubscription';
import {
  mutations as SubscriptionPlanMutations,
  queries as SubscriptionPlanQueries,
  types as SubscriptionPlanTypes,
} from '@/subscription/graphql/schemas/mushopSubscriptionPlan';

export const types = `
  ${SupplierTypes}
  ${ProductTypes}
  ${SubscriptionTypes}
  ${SubscriptionPlanTypes}
`;

export const queries = `
  ${SupplierQueries}
  ${ProductQueries}
  ${SubscriptionQueries}
  ${SubscriptionPlanQueries}
`;

export const mutations = `
  ${SupplierMutations}
  ${ProductMutations}
  ${SubscriptionMutations}
  ${SubscriptionPlanMutations}
`;

export default { types, queries, mutations };
