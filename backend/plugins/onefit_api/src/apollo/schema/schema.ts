import {
  types as CategoryTypes,
  queries as CategoryQueries,
  mutations as CategoryMutations,
} from '@/category/graphql/schemas/category';
import {
  providerReviewTypes,
  providerReviewQueries,
  providerReviewMutations,
} from '@/provider/graphql/schemas/providerReview';
import {
  types as ProviderTypes,
  queries as ProviderQueries,
  mutations as ProviderMutations,
} from '@/provider/graphql/schemas/provider';
import {
  types as ScheduleTypes,
  queries as ScheduleQueries,
  mutations as ScheduleMutations,
} from '@/schedule/graphql/schemas/schedule';
import {
  types as MembershipTypes,
  queries as MembershipQueries,
  mutations as MembershipMutations,
} from '@/membership/graphql/schemas/membership';
import {
  types as CreditTransactionTypes,
  queries as CreditTransactionQueries,
  mutations as CreditTransactionMutations,
} from '@/membership/graphql/schemas/credittransaction';
import {
  types as BookingTypes,
  queries as BookingQueries,
  mutations as BookingMutations,
} from '@/booking/graphql/schemas/booking';

import {
  types as ConfigTypes,
  queries as ConfigQueries,
  mutations as ConfigMutations,
} from '@/config/graphql/schemas/config';
import {
  types as OneFitCustomerTypes,
  queries as OneFitCustomerQueries,
  mutations as OneFitCustomerMutations,
} from '@/onefitCustomer/graphql/schemas/onefitCustomer';
import {
  types as ActivityTypeTypes,
  queries as ActivityTypeQueries,
  mutations as ActivityTypeMutations,
} from '@/activity-type/graphql/schemas/activityType';
import {
  types as BannerTypes,
  queries as BannerQueries,
  mutations as BannerMutations,
} from '@/banner/graphql/schemas/banner';
import {
  types as PromoCodeTypes,
  queries as PromoCodeQueries,
  mutations as PromoCodeMutations,
} from '@/promoCode/graphql/schemas/promoCode';
import {
  types as DashboardTypes,
  queries as DashboardQueries,
} from '@/dashboard/graphql/schemas/dashboard';
import { TypeExtensions } from './extensions';

export const types = `
  ${TypeExtensions}
  ${CategoryTypes}
  ${providerReviewTypes}
  ${ProviderTypes}
  ${ScheduleTypes}
  ${MembershipTypes}
  ${CreditTransactionTypes}
  ${BookingTypes}
  ${ConfigTypes}
  ${OneFitCustomerTypes}
  ${ActivityTypeTypes}
  ${BannerTypes}
  ${PromoCodeTypes}
  ${DashboardTypes}
`;

export const queries = `
  ${CategoryQueries}
  ${providerReviewQueries}
  ${ProviderQueries}
  ${ScheduleQueries}
  ${MembershipQueries}
  ${CreditTransactionQueries}
  ${BookingQueries}
  ${ConfigQueries}
  ${OneFitCustomerQueries}
  ${ActivityTypeQueries}
  ${BannerQueries}
  ${PromoCodeQueries}
  ${DashboardQueries}
`;

export const mutations = `
  ${CategoryMutations}
  ${providerReviewMutations}
  ${ProviderMutations}
  ${ScheduleMutations}
  ${MembershipMutations}
  ${CreditTransactionMutations}
  ${BookingMutations}
  ${ConfigMutations}
  ${OneFitCustomerMutations}
  ${ActivityTypeMutations}
  ${BannerMutations}
  ${PromoCodeMutations}
`;

export default { types, queries, mutations };
