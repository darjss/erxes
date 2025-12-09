import { IOneFitCustomerDocument } from '@/onefitCustomer/@types/onefitCustomer';
import { IContext } from '~/connectionResolvers';

export default {
  Customer: {
    __resolveReference: async ({ _id }: { _id: string }, { models }: IContext) => {
      // Try to find as OneFitCustomer first, fallback to regular Customer
      const oneFitCustomer = await models.OneFitCustomer.findOne({ _id });
      if (oneFitCustomer) {
        return oneFitCustomer;
      }
      // If not found, it might be a regular customer - return null to let core-api handle it
      return null;
    },
    oneFitMembershipPlanId: (customer: IOneFitCustomerDocument) => {
      if (!customer || !('membershipPlanId' in customer)) {
        return null;
      }
      return customer.membershipPlanId;
    },
    oneFitMembershipExpiresAt: (customer: IOneFitCustomerDocument) => {
      if (!customer || !('membershipExpiresAt' in customer)) {
        return null;
      }
      return customer.membershipExpiresAt;
    },
    oneFitMembershipStatus: (customer: IOneFitCustomerDocument) => {
      if (!customer || !('membershipStatus' in customer)) {
        return 'none';
      }
      return customer.membershipStatus || 'none';
    },
    oneFitCurrentCreditBalance: (customer: IOneFitCustomerDocument) => {
      if (!customer || !('currentCreditBalance' in customer)) {
        return 0;
      }
      return customer.currentCreditBalance || 0;
    },
    oneFitTotalCreditsEarned: (customer: IOneFitCustomerDocument) => {
      if (!customer || !('totalCreditsEarned' in customer)) {
        return 0;
      }
      return customer.totalCreditsEarned || 0;
    },
    oneFitTotalCreditsUsed: (customer: IOneFitCustomerDocument) => {
      if (!customer || !('totalCreditsUsed' in customer)) {
        return 0;
      }
      return customer.totalCreditsUsed || 0;
    },
    oneFitPreferredActivityTypes: (customer: IOneFitCustomerDocument) => {
      if (!customer || !('preferredActivityTypes' in customer)) {
        return [];
      }
      return customer.preferredActivityTypes || [];
    },
    oneFitBookingPreferences: (customer: IOneFitCustomerDocument) => {
      if (!customer || !('bookingPreferences' in customer)) {
        return null;
      }
      return customer.bookingPreferences;
    },
    oneFitLastBookingDate: (customer: IOneFitCustomerDocument) => {
      if (!customer || !('lastBookingDate' in customer)) {
        return null;
      }
      return customer.lastBookingDate;
    },
    oneFitTotalBookings: (customer: IOneFitCustomerDocument) => {
      if (!customer || !('totalBookings' in customer)) {
        return 0;
      }
      return customer.totalBookings || 0;
    },
  },
};

