import { cvClientMutations } from '~/modules/client/graphql/resolvers/mutations/client';
import { cvMarketMutations } from '~/modules/market/graphql/resolvers/mutations/market';

export const mutations = {
  ...cvClientMutations,
  ...cvMarketMutations,
};
