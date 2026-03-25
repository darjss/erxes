import { blockAgencyMutations } from '~/modules/agency/graphql/resolvers/mutations/agency';
import { blockListingMutations } from '~/modules/listing/graphql/resolvers/mutations/listing';

export const mutations = {
  ...blockAgencyMutations,
  ...blockListingMutations,
};
