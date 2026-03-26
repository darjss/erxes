import { providerQueries } from '@/provider/graphql/resolvers/queries/provider';

import { configQueries } from '@/config/graphql/resolvers/queries/config';

import { bannerQueries } from '@/banner/graphql/resolvers/queries/banner';

import { registrationQueries } from '@/registration/graphql/resolvers/queries/registration';

export const queries = {
  ...providerQueries,
  ...configQueries,
  ...bannerQueries,
  ...registrationQueries,
};
