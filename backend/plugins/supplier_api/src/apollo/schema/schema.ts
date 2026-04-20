import {
  mutations as SupplierMutations,
  queries as SupplierQueries,
  types as SupplierTypes,
} from '@/supplier/graphql/schemas/supplier';
import {
  mutations as SubmissionMutations,
  queries as SubmissionQueries,
  types as SubmissionTypes,
  inputTypes as SubmissionInputTypes,
} from '@/platform/graphql/schemas/submission';

export const types = `
  ${SupplierTypes}
  ${SubmissionTypes}
  ${SubmissionInputTypes}
`;

export const queries = `
  ${SupplierQueries}
  ${SubmissionQueries}
`;

export const mutations = `
  ${SupplierMutations}
  ${SubmissionMutations}
`;

export default { types, queries, mutations };
