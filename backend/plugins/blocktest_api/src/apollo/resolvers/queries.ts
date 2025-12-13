import { cvClientQueries } from '~/modules/client/graphql/resolvers/queries/client';
import { cvMarketQueries } from '~/modules/market/graphql/resolvers/queries/market';

export const queries = {
  ...cvClientQueries,
  ...cvMarketQueries,
};
