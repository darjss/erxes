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
} from '@/subscription/graphql/schemas/customerSubscription';

export const types = `
  ${SupplierTypes}
  ${ProductTypes}
  ${SubscriptionTypes}
`;

export const queries = `
  ${SupplierQueries}
  ${ProductQueries}
  ${SubscriptionQueries}
`;

export const mutations = `
  ${SupplierMutations}
  ${ProductMutations}
  ${SubscriptionMutations}
`;

export default { types, queries, mutations };
