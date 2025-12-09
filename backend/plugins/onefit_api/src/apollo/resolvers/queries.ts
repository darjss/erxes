import { categoryQueries } from '@/category/graphql/resolvers/queries/category';
import { providerQueries } from '@/provider/graphql/resolvers/queries/provider';
import { scheduleQueries } from '@/schedule/graphql/resolvers/queries/schedule';
import { membershipQueries } from '@/membership/graphql/resolvers/queries/membership';
import { creditTransactionQueries } from '@/membership/graphql/resolvers/queries/credittransaction';
import { bookingQueries } from '@/booking/graphql/resolvers/queries/booking';

import { notificationQueries } from '@/notification/graphql/resolvers/queries/notification';
import { configQueries } from '@/config/graphql/resolvers/queries/config';
import { oneFitCustomerQueries } from '@/onefitCustomer/graphql/resolvers/queries/onefitCustomer';
import { activityTypeQueries } from '@/activity-type/graphql/resolvers/queries/activityType';

export const queries = {
  ...categoryQueries,
  ...providerQueries,
  ...scheduleQueries,
  ...membershipQueries,
  ...creditTransactionQueries,
  ...bookingQueries,
  ...notificationQueries,
  ...configQueries,
  ...oneFitCustomerQueries,
  ...activityTypeQueries,
};
