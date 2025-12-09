import { IContext } from '~/connectionResolvers';
import { IMembershipPlan } from '@/membership/@types/membership';
import {
  CreditTransactionType,
  CreditSource,
} from '@/membership/@types/credittransaction';
import { sendTRPCMessage } from 'erxes-api-shared/utils';

export const membershipMutations = {
  async oneFitMembershipPlanCreate(
    _root: undefined,
    doc: IMembershipPlan,
    { models }: IContext,
  ) {
    return await models.MembershipPlan.createPlan({ ...doc });
  },

  async oneFitMembershipPlanUpdate(
    _root: undefined,
    { _id, ...doc }: { _id: string } & Partial<IMembershipPlan>,
    { models }: IContext,
  ) {
    return await models.MembershipPlan.updatePlan(_id, doc);
  },

  async oneFitMembershipPlansRemove(
    _root: undefined,
    { ids }: { ids: string[] },
    { models }: IContext,
  ) {
    return await models.MembershipPlan.removePlans(ids);
  },

  async oneFitMembershipPurchaseCreate(
    _root: undefined,
    { userId, planId }: { userId: string; planId: string },
    { models, subdomain }: IContext,
  ) {
    const plan = await models.MembershipPlan.findOne({ _id: planId });
    if (!plan) {
      throw new Error('Membership plan not found');
    }

    const purchasedAt = new Date();
    const expiresAt = new Date(
      purchasedAt.getTime() + plan.duration * 24 * 60 * 60 * 1000,
    );

    // Check if OneFitCustomer exists
    let oneFitCustomer;
    try {
      oneFitCustomer = await models.OneFitCustomer.getOneFitCustomer(userId);
    } catch (error) {
      // If query fails, assume OneFitCustomer doesn't exist yet
      oneFitCustomer = null;
    }
    if (!oneFitCustomer) {
      // Verify customer exists
      const customer = await sendTRPCMessage({
        subdomain,
        pluginName: 'core',
        method: 'query',
        module: 'customers',
        action: 'findOne',
        input: {
          query: { _id: userId },
        },
        defaultValue: null,
      });

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Update erxes customer to have state='customer'
      await sendTRPCMessage({
        subdomain,
        pluginName: 'core',
        method: 'mutation',
        module: 'customers',
        action: 'updateCustomer',
        input: {
          _id: userId,
          doc: { state: 'customer' },
        },
      });

      // Create OneFitCustomer by updating the customer document with discriminator
      await models.OneFitCustomer.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            __t: 'OneFitCustomer',
            membershipStatus: 'none',
            currentCreditBalance: 0,
            totalCreditsEarned: 0,
            totalCreditsUsed: 0,
            totalBookings: 0,
          },
        },
        { upsert: false, new: true },
      );

      oneFitCustomer = await models.OneFitCustomer.getOneFitCustomer(userId);
    }

    // Update OneFitCustomer with membership information
    if (oneFitCustomer) {
      await models.OneFitCustomer.updateMembership(userId, planId, expiresAt);
    }

    // Create credit transaction for the purchase
    const balanceBefore = await models.CreditTransaction.getUserBalance(userId);
    const balanceAfter = balanceBefore + plan.creditAmount;
    const creditTransaction = await models.CreditTransaction.createTransaction({
      userId,
      amount: plan.creditAmount,
      transactionType: CreditTransactionType.PURCHASE,
      source: CreditSource.INDIVIDUAL,
      description: `Membership purchase: ${plan.name}`,
      balanceAfter,
    });

    // Update OneFitCustomer credit balance fields
    if (oneFitCustomer) {
      await models.OneFitCustomer.updateCreditBalanceAndEarned(
        userId,
        balanceAfter,
        plan.creditAmount,
      );
    }

    return plan;
  },
};
