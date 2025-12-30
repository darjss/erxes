import creditTransactionCustomResolvers from '@/membership/graphql/resolvers/customResolvers/credittransaction';
import membershipPurchaseCustomResolvers from '@/membership/graphql/resolvers/customResolvers/membershippurchase';
import oneFitCustomerCustomResolvers from '@/onefitCustomer/graphql/resolvers/customResolvers/onefitCustomer';
import activityTypeCustomResolvers from '@/activity-type/graphql/resolvers/customResolvers/activityType';
import scheduleTemplateCustomResolvers from '@/schedule/graphql/resolvers/customResolvers/schedule';
import bookingCustomResolvers from '@/booking/graphql/resolvers/customResolvers/booking';

export const customResolvers = {
  ...creditTransactionCustomResolvers,
  ...membershipPurchaseCustomResolvers,
  ...oneFitCustomerCustomResolvers,
  ...activityTypeCustomResolvers,
  ...scheduleTemplateCustomResolvers,
  ...bookingCustomResolvers,
};
