import { IContext } from '~/connectionResolvers';

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
    return await models.OneFitCustomer.updateBookingPreferences(_id, preferences);
  },
};

