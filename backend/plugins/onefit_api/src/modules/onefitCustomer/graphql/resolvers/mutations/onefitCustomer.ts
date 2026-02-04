import { IContext } from '~/connectionResolvers';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const oneFitCustomerMutations = {
  async oneFitCustomerUpdateMembership(
    _root: undefined,
    {
      _id,
      membershipPlanId,
      expiresAt,
    }: { _id: string; membershipPlanId: string; expiresAt: Date },
    { models }: IContext,
  ) {
    return await models.OneFitCustomer.updateMembership(
      _id,
      membershipPlanId,
      new Date(expiresAt),
    );
  },

  async oneFitCustomerUpdateCreditBalance(
    _root: undefined,
    { _id, balance }: { _id: string; balance: number },
    { models }: IContext,
  ) {
    return await models.OneFitCustomer.updateCreditBalance(_id, balance);
  },

  async oneFitCustomerUpdateBookingPreferences(
    _root: undefined,
    { _id, preferences }: { _id: string; preferences: any },
    { models }: IContext,
  ) {
    return await models.OneFitCustomer.updateBookingPreferences(
      _id,
      preferences,
    );
  },

  async oneFitMembershipHoldStart(
    _root: undefined,
    { userId, holdDays }: { userId: string; holdDays: number },
    { models }: IContext,
  ) {
    const customer = await models.OneFitCustomer.getOneFitCustomer(userId);
    if (!customer) {
      throw new Error('Customer not found');
    }
    if (customer.membershipStatus !== 'active') {
      throw new Error('Membership must be active to start a hold');
    }
    if (customer.isMembershipOnHold) {
      throw new Error('Membership is already on hold');
    }
    if (customer.membershipHoldEndedAt) {
      const nextHoldAllowedAt =
        new Date(customer.membershipHoldEndedAt).getTime() + THIRTY_DAYS_MS;
      if (Date.now() < nextHoldAllowedAt) {
        throw new Error('You can only hold once every 30 days');
      }
    }
    if (holdDays <= 0) {
      throw new Error('holdDays must be greater than 0');
    }
    const maxHoldDaysConfig = await models.SystemConfig.getConfig(
      'membership_hold_max_days',
    );
    if (maxHoldDaysConfig?.value != null) {
      const maxHoldDays = Number(maxHoldDaysConfig.value);
      if (holdDays > maxHoldDays) {
        throw new Error(
          `Hold days cannot exceed ${maxHoldDays}. Please use a value between 1 and ${maxHoldDays}.`,
        );
      }
    }
    return await models.OneFitCustomer.startMembershipHold(userId, holdDays);
  },

  async oneFitMembershipHoldCancel(
    _root: undefined,
    { userId }: { userId: string },
    { models }: IContext,
  ) {
    const customer = await models.OneFitCustomer.getOneFitCustomer(userId);
    if (!customer) {
      throw new Error('Customer not found');
    }
    if (!customer.isMembershipOnHold) {
      throw new Error('Membership is not on hold');
    }
    return await models.OneFitCustomer.cancelMembershipHold(userId);
  },
};
