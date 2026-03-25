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

export const types = `
  ${BlockAgencyTypes}
  ${BlockListingTypes}
`;

export const queries = `
  ${BlockAgencyQueries}
  ${BlockListingQueries}
`;

export const mutations = `
  ${BlockAgencyMutations}
  ${BlockListingMutations}
`;

export default { types, queries, mutations };
