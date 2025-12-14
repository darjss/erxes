import { cvClientQueries } from '@/client/graphql/resolvers/queries/client';
import { cvMarketQueries } from '@/market/graphql/resolvers/queries/market';
import { cvRiskGroupQueries } from '@/risk/graphql/resolvers/queries/riskGroup';

export const queries = {
  ...cvClientQueries,
  ...cvMarketQueries,
  ...cvRiskGroupQueries,
};
