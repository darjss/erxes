import {
  mutations as BlockAgencyMutations,
  queries as BlockAgencyQueries,
  types as BlockAgencyTypes,
} from '~/modules/agency/graphql/schemas/agency';

import {
  mutations as BlockListingMutations,
  queries as BlockListingQueries,
  types as BlockListingTypes,
} from '~/modules/listing/graphql/schemas/listing';

import {
  mutations as BlockMemberMutations,
  queries as BlockMemberQueries,
  types as BlockMemberTypes,
} from '~/modules/member/graphql/schemas/member';

export const types = `
  ${BlockAgencyTypes}
  ${BlockListingTypes}
  ${BlockMemberTypes}
`;

export const queries = `
  ${BlockAgencyQueries}
  ${BlockListingQueries}
  ${BlockMemberQueries}
`;

export const mutations = `
  ${BlockAgencyMutations}
  ${BlockListingMutations}
  ${BlockMemberMutations}
`;

export default { types, queries, mutations };
