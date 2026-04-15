import { blockAgencyQueries } from '~/modules/agency/graphql/resolvers/queries/agency';
import { blockListingQueries } from '~/modules/listing/graphql/resolvers/queries/listing';
import { blockMemberQueries } from '~/modules/member/graphql/resolvers/queries/member';
import { blockUnitQueries } from '~/modules/unit/graphql/resolvers/queries/unit';

export const queries = {
  ...blockAgencyQueries,
  ...blockListingQueries,
  ...blockMemberQueries,
  ...blockUnitQueries,
};
