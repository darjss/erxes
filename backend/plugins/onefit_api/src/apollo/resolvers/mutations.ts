import { categoryMutations } from '@/category/graphql/resolvers/mutations/category';
import { providerMutations } from '@/provider/graphql/resolvers/mutations/provider';
import { scheduleMutations } from '@/schedule/graphql/resolvers/mutations/schedule';
import { membershipMutations } from '@/membership/graphql/resolvers/mutations/membership';
import { creditTransactionMutations } from '@/membership/graphql/resolvers/mutations/credittransaction';
import { bookingMutations } from '@/booking/graphql/resolvers/mutations/booking';

import { notificationMutations } from '@/notification/graphql/resolvers/mutations/notification';
import { configMutations } from '@/config/graphql/resolvers/mutations/config';
import { oneFitCustomerMutations } from '@/onefitCustomer/graphql/resolvers/mutations/onefitCustomer';
import { activityTypeMutations } from '@/activity-type/graphql/resolvers/mutations/activityType';

export const mutations = {
  ...categoryMutations,
  ...providerMutations,
  ...scheduleMutations,
  ...membershipMutations,
  ...creditTransactionMutations,
  ...bookingMutations,

  ...notificationMutations,
  ...configMutations,
  ...oneFitCustomerMutations,
  ...activityTypeMutations,
};
