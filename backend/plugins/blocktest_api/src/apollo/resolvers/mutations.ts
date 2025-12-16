import { cvClientMutations } from '@/client/graphql/resolvers/mutations/client';
import { cvMarketMutations } from '@/market/graphql/resolvers/mutations/market';
import { cvRiskGroupMutations } from '@/risk/graphql/resolvers/mutations/riskGroup';

export const mutations = {
  ...cvClientMutations,
  ...cvMarketMutations,
  ...cvRiskGroupMutations,
};
