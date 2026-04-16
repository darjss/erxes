import { categoryQueries } from '@/category/graphql/resolvers/queries/category';
import { providerQueries } from '@/provider/graphql/resolvers/queries/provider';
import { providerReviewQueries } from '@/provider/graphql/resolvers/queries/providerReview';
import { scheduleQueries } from '@/schedule/graphql/resolvers/queries/schedule';
import { membershipQueries } from '@/membership/graphql/resolvers/queries/membership';
import { creditTransactionQueries } from '@/membership/graphql/resolvers/queries/credittransaction';
import { bookingQueries } from '@/booking/graphql/resolvers/queries/booking';

import { configQueries } from '@/config/graphql/resolvers/queries/config';
import { oneFitCustomerQueries } from '@/onefitCustomer/graphql/resolvers/queries/onefitCustomer';
import { activityTypeQueries } from '@/activity-type/graphql/resolvers/queries/activityType';
import { bannerQueries } from '@/banner/graphql/resolvers/queries/banner';
import { promoCodeQueries } from '@/promoCode/graphql/resolvers/queries/promoCode';
import { dashboardQueries } from '@/dashboard/graphql/resolvers/queries/dashboard';

export const queries = {
  ...categoryQueries,
  ...providerQueries,
  ...providerReviewQueries,
  ...scheduleQueries,
  ...membershipQueries,
  ...creditTransactionQueries,
  ...bookingQueries,
  ...configQueries,
  ...oneFitCustomerQueries,
  ...activityTypeQueries,
  ...bannerQueries,
  ...promoCodeQueries,
  ...dashboardQueries,
};
