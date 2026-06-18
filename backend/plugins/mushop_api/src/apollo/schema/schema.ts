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
  mutations as MembershipMutations,
  queries as MembershipQueries,
  types as MembershipTypes,
} from '@/membership/graphql/schemas/mushopMembership';
import {
  mutations as MembershipPlanMutations,
  queries as MembershipPlanQueries,
  types as MembershipPlanTypes,
} from '@/membership/graphql/schemas/mushopMembershipPlan';
import {
  queries as CustomerInvoiceQueries,
  types as CustomerInvoiceTypes,
} from '@/membership/graphql/schemas/invoices';
import {
  mutations as CollectiveMutations,
  queries as CollectiveQueries,
  types as CollectiveTypes,
} from '@/collective/graphql/schemas/collective';
import {
  mutations as CollectivePackageMutations,
  queries as CollectivePackageQueries,
  types as CollectivePackageTypes,
} from '@/collective-package/graphql/schemas/collectivePackage';
import { TypeExtensions } from './extensions';

export const types = `
  ${TypeExtensions}

  ${SupplierTypes}
  ${ProductTypes}
  ${MembershipTypes}
  ${MembershipPlanTypes}
  ${CustomerInvoiceTypes}
  ${CollectiveTypes}
  ${CollectivePackageTypes}
`;

export const queries = `
  ${SupplierQueries}
  ${ProductQueries}
  ${MembershipQueries}
  ${MembershipPlanQueries}
  ${CustomerInvoiceQueries}
  ${CollectiveQueries}
  ${CollectivePackageQueries}
`;

export const mutations = `
  ${SupplierMutations}
  ${ProductMutations}
  ${MembershipMutations}
  ${MembershipPlanMutations}
  ${CollectiveMutations}
  ${CollectivePackageMutations}
`;

export default { types, queries, mutations };
