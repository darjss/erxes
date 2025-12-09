import { IContext } from '~/connectionResolvers';
import {
  CreditTransactionType,
  CreditSource,
} from '@/membership/@types/credittransaction';
import { sendTRPCMessage } from 'erxes-api-shared/utils';

export const creditTransactionMutations = {
  async oneFitCreditTransactionsRemove(
    _root: undefined,
    { ids }: { ids: string[] },
    { models }: IContext,
  ) {
    return await models.CreditTransaction.removeTransactions(ids);
  },

  async oneFitCreditTransactionCreate(
    _root: undefined,
    {
      userId,
      amount,
      transactionType,
      source,
      bookingId,
      corporateCreditId,
      membershipPlanId,
      description,
    }: {
      userId: string;
      amount: number;
      transactionType: CreditTransactionType;
      source: CreditSource;
      bookingId?: string;
      corporateCreditId?: string;
      membershipPlanId?: string;
      description?: string;
    },
    { models, subdomain }: IContext,
  ) {
    const currentBalance = await models.CreditTransaction.getUserBalance(
      userId,
    );
    const balanceAfter = currentBalance + amount;

    const transaction = await models.CreditTransaction.createTransaction({
      userId,
      amount,
      transactionType,
      source,
      bookingId,
      corporateCreditId,
      description: description || `Membership purchase: `,
      balanceAfter,
    });

    const plan = await models.MembershipPlan.findOne({ _id: membershipPlanId });
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
    if (oneFitCustomer && membershipPlanId) {
      await models.OneFitCustomer.updateMembership(
        userId,
        membershipPlanId,
        expiresAt,
      );
    }

    // Update OneFitCustomer credit balance fields
    if (oneFitCustomer) {
      await models.OneFitCustomer.updateCreditBalanceAndEarned(
        userId,
        balanceAfter,
        plan.creditAmount,
      );
    }

    return transaction;
  },
};
