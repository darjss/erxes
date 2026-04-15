import { blockAgencyMutations } from '~/modules/agency/graphql/resolvers/mutations/agency';
import { blockListingMutations } from '~/modules/listing/graphql/resolvers/mutations/listing';
import { blockMemberMutations } from '~/modules/member/graphql/resolvers/mutations/member';
import { blockUnitMutations } from '~/modules/unit/graphql/resolvers/mutations/unit';

export const mutations = {
  ...blockAgencyMutations,
  ...blockListingMutations,
  ...blockMemberMutations,
  ...blockUnitMutations,
};
