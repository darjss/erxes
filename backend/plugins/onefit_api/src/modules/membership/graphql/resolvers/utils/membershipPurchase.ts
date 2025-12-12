import { IContext } from '~/connectionResolvers';
import { IMembershipPlanDocument } from '@/membership/@types/membership';
import {
  CreditTransactionType,
  CreditSource,
} from '@/membership/@types/credittransaction';
import { sendTRPCMessage } from 'erxes-api-shared/utils';

export async function ensureOneFitCustomerExists(
  userId: string,
  { models, subdomain }: IContext,
) {
  let oneFitCustomer;
  try {
    oneFitCustomer = await models.OneFitCustomer.getOneFitCustomer(userId);
  } catch (error) {
    oneFitCustomer = null;
  }

  if (!oneFitCustomer) {
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

  return oneFitCustomer;
}

export async function updateCustomerMembership(
  userId: string,
  planId: string,
  expiresAt: Date,
  context: IContext,
) {
  const { models } = context;
  const oneFitCustomer = await ensureOneFitCustomerExists(userId, context);

  if (oneFitCustomer) {
    await models.OneFitCustomer.updateMembership(userId, planId, expiresAt);
  }

  return oneFitCustomer;
}

export async function createCreditTransactionForPurchase(
  userId: string,
  plan: IMembershipPlanDocument,
  { models }: IContext,
) {
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

  return { creditTransaction, balanceAfter };
}

export async function updateCustomerCreditBalance(
  userId: string,
  balanceAfter: number,
  creditAmount: number,
  context: IContext,
) {
  const { models } = context;
  const oneFitCustomer = await models.OneFitCustomer.getOneFitCustomer(
    userId,
  ).catch(() => null);

  if (oneFitCustomer) {
    await models.OneFitCustomer.updateCreditBalanceAndEarned(
      userId,
      balanceAfter,
      creditAmount,
    );
  }
}

export async function processMembershipPurchase(
  userId: string,
  planId: string,
  context: IContext,
) {
  const { models } = context;

  const plan = await models.MembershipPlan.findOne({ _id: planId });
  if (!plan) {
    throw new Error('Membership plan not found');
  }

  const purchasedAt = new Date();
  const expiresAt = new Date(
    purchasedAt.getTime() + plan.duration * 24 * 60 * 60 * 1000,
  );

  const oneFitCustomer = await ensureOneFitCustomerExists(userId, context);

  if (oneFitCustomer) {
    await models.OneFitCustomer.updateMembership(userId, planId, expiresAt);
  }

  const { balanceAfter } = await createCreditTransactionForPurchase(
    userId,
    plan,
    context,
  );

  if (oneFitCustomer) {
    await updateCustomerCreditBalance(
      userId,
      balanceAfter,
      plan.creditAmount,
      context,
    );
  }

  return plan;
}
