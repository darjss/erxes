import { IContext } from '~/connectionResolvers';
import {
  CreditTransactionType,
  CreditSource,
  ICreditTransactionDocument,
} from '@/membership/@types/credittransaction';
import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { recomputeOneFitCustomerCreditFields } from '@/membership/graphql/resolvers/utils/creditTransactionUtils';
import { isCreditOnlyPlan } from '@/membership/graphql/resolvers/utils/membershipPurchase';

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
      throw new Error('Cannot delete credit transactions linked to a booking');
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

    const latestByUser: Record<string, ICreditTransactionDocument | null> = {};
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

    const defaultDescription =
      transactionType === CreditTransactionType.PURCHASE
        ? 'Membership purchase'
        : `Credit ${transactionType}`;
    const transaction = await models.CreditTransaction.createTransaction({
      userId,
      amount,
      transactionType,
      source,
      bookingId,
      corporateCreditId,
      description: description ?? defaultDescription,
      balanceAfter,
    });

    const isPurchaseWithPlan =
      transactionType === CreditTransactionType.PURCHASE && membershipPlanId;
    let plan: {
      planType?: string;
      duration?: number;
      creditAmount: number;
      name?: string;
    } | null = null;
    if (isPurchaseWithPlan) {
      plan = await models.MembershipPlan.findOne({
        _id: membershipPlanId,
      }).lean();
      if (!plan) {
        throw new Error('Membership plan not found');
      }
    }

    // Ensure OneFitCustomer exists
    let oneFitCustomer;
    try {
      oneFitCustomer = await models.OneFitCustomer.getOneFitCustomer(userId);
    } catch {
      oneFitCustomer = null;
    }
    if (!oneFitCustomer) {
      const customer = await sendTRPCMessage({
        subdomain,
        pluginName: 'core',
        method: 'query',
        module: 'customers',
        action: 'findOne',
        input: { query: { _id: userId } },
        defaultValue: null,
      });
      if (!customer) {
        throw new Error('Customer not found');
      }
      await sendTRPCMessage({
        subdomain,
        pluginName: 'core',
        method: 'mutation',
        module: 'customers',
        action: 'updateCustomer',
        input: { _id: userId, doc: { state: 'customer' } },
      });
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

    if (!oneFitCustomer) {
      return transaction;
    }

    if (isPurchaseWithPlan && plan) {
      if (isCreditOnlyPlan(plan)) {
        await models.OneFitCustomer.updateCreditBalanceAndEarned(
          userId,
          balanceAfter,
          plan.creditAmount,
        );
      } else {
        const duration = plan.duration ?? 30;
        const purchasedAt = new Date();
        const expiresAt = new Date(
          purchasedAt.getTime() + duration * 24 * 60 * 60 * 1000,
        );
        await models.OneFitCustomer.updateMembership(
          userId,
          membershipPlanId!,
          expiresAt,
        );
        await models.OneFitCustomer.updateCreditBalanceAndEarned(
          userId,
          balanceAfter,
          plan.creditAmount,
        );
      }
    } else {
      switch (transactionType) {
        case CreditTransactionType.PURCHASE:
          await models.OneFitCustomer.updateCreditBalanceAndEarned(
            userId,
            balanceAfter,
            amount,
          );
          break;
        case CreditTransactionType.USAGE:
        case CreditTransactionType.EXPIRATION:
          await models.OneFitCustomer.updateCreditBalanceAndUsed(
            userId,
            balanceAfter,
            Math.abs(amount),
          );
          break;
        case CreditTransactionType.REFUND:
          await models.OneFitCustomer.updateCreditBalanceForRefund(
            userId,
            balanceAfter,
            Math.abs(amount),
          );
          break;
      }
    }

    return transaction;
  },
};
