import {
  types as CategoryTypes,
  queries as CategoryQueries,
  mutations as CategoryMutations,
} from '@/category/graphql/schemas/category';
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
  types as NotificationTypes,
  queries as NotificationQueries,
  mutations as NotificationMutations,
} from '@/notification/graphql/schemas/notification';
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
import { TypeExtensions } from './extensions';

export const types = `
  ${TypeExtensions}
  ${CategoryTypes}
  ${ProviderTypes}
  ${ScheduleTypes}
  ${MembershipTypes}
  ${CreditTransactionTypes}
  ${BookingTypes}
  ${NotificationTypes}
  ${ConfigTypes}
  ${OneFitCustomerTypes}
  ${ActivityTypeTypes}
`;

export const queries = `
  ${CategoryQueries}
  ${ProviderQueries}
  ${ScheduleQueries}
  ${MembershipQueries}
  ${CreditTransactionQueries}
  ${BookingQueries}
  ${NotificationQueries}
  ${ConfigQueries}
  ${OneFitCustomerQueries}
  ${ActivityTypeQueries}
`;

export const mutations = `
  ${CategoryMutations}
  ${ProviderMutations}
  ${ScheduleMutations}
  ${MembershipMutations}
  ${CreditTransactionMutations}
  ${BookingMutations}
  ${NotificationMutations}
  ${ConfigMutations}
  ${OneFitCustomerMutations}
  ${ActivityTypeMutations}
`;

export default { types, queries, mutations };
