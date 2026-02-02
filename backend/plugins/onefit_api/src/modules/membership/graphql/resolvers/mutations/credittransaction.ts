import { IContext } from '~/connectionResolvers';
import {
  CreditTransactionType,
  CreditSource,
  ICreditTransactionDocument,
} from '@/membership/@types/credittransaction';
import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { recomputeOneFitCustomerCreditFields } from '@/membership/graphql/resolvers/utils/creditTransactionUtils';

export const creditTransactionMutations = {
  async oneFitCreditTransactionsRemove(
    _root: undefined,
    { ids }: { ids: string[] },
    { models }: IContext,
  ) {
    if (!ids.length) {
      return { n: 0, ok: 0 };
    }

    const transactions = await models.CreditTransaction.find({
      _id: { $in: ids },
    });

    const linkedToBooking = transactions.filter(
      (tx) => tx.bookingId != null && tx.bookingId !== '',
    );
    if (linkedToBooking.length > 0) {
      throw new Error(
        'Cannot delete credit transactions linked to a booking',
      );
    }

    const linkedToCorporate = transactions.filter(
      (tx) => tx.corporateCreditId != null && tx.corporateCreditId !== '',
    );
    if (linkedToCorporate.length > 0) {
      throw new Error(
        'Cannot delete credit transactions linked to corporate credit',
      );
    }

    const affectedUserIds = [
      ...new Set(transactions.map((tx) => tx.userId)),
    ] as string[];

    const latestByUser: Record<
      string,
      ICreditTransactionDocument | null
    > = {};
    for (const userId of affectedUserIds) {
      latestByUser[userId] =
        await models.CreditTransaction.getLatestTransaction(userId);
    }
    for (const tx of transactions) {
      const latest = latestByUser[tx.userId];
      if (!latest || tx._id !== latest._id) {
        throw new Error(
          "Cannot remove credit transaction: it is not the user's latest transaction.",
        );
      }
    }

    const result = await models.CreditTransaction.removeTransactions(ids);

    for (const userId of affectedUserIds) {
      await recomputeOneFitCustomerCreditFields(userId, models);
    }

    return result;
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
