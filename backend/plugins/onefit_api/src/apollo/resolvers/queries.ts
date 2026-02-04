import { categoryQueries } from '@/category/graphql/resolvers/queries/category';
import { providerQueries } from '@/provider/graphql/resolvers/queries/provider';
import { scheduleQueries } from '@/schedule/graphql/resolvers/queries/schedule';
import { membershipQueries } from '@/membership/graphql/resolvers/queries/membership';
import { creditTransactionQueries } from '@/membership/graphql/resolvers/queries/credittransaction';
import { bookingQueries } from '@/booking/graphql/resolvers/queries/booking';

import { configQueries } from '@/config/graphql/resolvers/queries/config';
import { oneFitCustomerQueries } from '@/onefitCustomer/graphql/resolvers/queries/onefitCustomer';
import { activityTypeQueries } from '@/activity-type/graphql/resolvers/queries/activityType';
import { bannerQueries } from '@/banner/graphql/resolvers/queries/banner';

export const queries = {
  ...categoryQueries,
  ...providerQueries,
  ...scheduleQueries,
  ...membershipQueries,
  ...creditTransactionQueries,
  ...bookingQueries,
  ...configQueries,
  ...oneFitCustomerQueries,
  ...activityTypeQueries,
  ...bannerQueries,
};
