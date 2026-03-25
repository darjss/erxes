import { blockAgencyQueries } from '~/modules/agency/graphql/resolvers/queries/agency';
import { blockListingQueries } from '~/modules/listing/graphql/resolvers/queries/listing';

export const queries = {
  ...blockAgencyQueries,
  ...blockListingQueries,
};
