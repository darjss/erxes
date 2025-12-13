import {
  mutations as CVClientMutations,
  queries as CVClientQueries,
  types as CVClientTypes,
} from '~/modules/client/graphql/schemas/client';
import {
  mutations as CVMarketMutations,
  queries as CVMarketQueries,
  types as CVMarketTypes,
} from '~/modules/market/graphql/schemas/market';

export const types = `
  ${CVClientTypes}
  ${CVMarketTypes}
    `;

export const queries = `
  ${CVClientQueries}
  ${CVMarketQueries}
`;

export const mutations = `
  ${CVClientMutations}
  ${CVMarketMutations}
`;

export default { types, queries, mutations };
