import {
  mutations as CVClientMutations,
  queries as CVClientQueries,
  types as CVClientTypes,
} from '@/client/graphql/schemas/client';
import {
  mutations as CVMarketMutations,
  queries as CVMarketQueries,
  types as CVMarketTypes,
} from '@/market/graphql/schemas/market';

import {
  mutations as CVRiskGroupMutations,
  queries as CVRiskGroupQueries,
  types as CVRiskGroupTypes,
} from '@/risk/graphql/schemas/riskGroup';

export const types = `
  ${CVClientTypes}
  ${CVMarketTypes}
  ${CVRiskGroupTypes}
    `;

export const queries = `
  ${CVClientQueries}
  ${CVMarketQueries}
  ${CVRiskGroupQueries}
`;

export const mutations = `
  ${CVClientMutations}
  ${CVMarketMutations}
  ${CVRiskGroupMutations}
`;

export default { types, queries, mutations };
