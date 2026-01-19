import { IContext } from '~/connectionResolvers';
import { IMembershipPlanDocument } from '@/membership/@types/membership';
import {
  CreditTransactionType,
  CreditSource,
} from '@/membership/@types/credittransaction';
import { sendTRPCMessage, getEnv, getPlugin } from 'erxes-api-shared/utils';
import { MembershipPurchaseStatus } from '@/membership/@types/membershippurchase';

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

export async function createMembershipPurchaseInvoice(
  userId: string,
  planId: string,
  context: IContext,
) {
  const { models, subdomain } = context;

  const plan = await models.MembershipPlan.findOne({ _id: planId });
  if (!plan) {
    throw new Error('Membership plan not found');
  }

  // Get customer info
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

  // Create membership purchase record
  const membershipPurchase = await models.MembershipPurchase.createPurchase({
    userId,
    planId,
    status: MembershipPurchaseStatus.PENDING,
    purchasedAt: new Date(),
    amount: plan.price,
  });

  // Get paymentIds from config
  const selectedPaymentsConfig = await models.SystemConfig.getConfig(
    'selectedPayments',
  );
  const paymentIds: string[] =
    (selectedPaymentsConfig?.value as string[]) || [];

  if (paymentIds.length === 0) {
    throw new Error(
      'No payment methods configured. Please configure payments in settings.',
    );
  }

  // Create invoice using tRPC
  const invoiceInput: any = {
    amount: plan.price,
    currency: 'MNT',
    description: `Membership purchase: ${plan.name}`,
    status: 'pending',
    customerType: 'customer',
    customerId: userId,
    contentType: 'onefit:membership:membershippurchase',
    contentTypeId: membershipPurchase._id,
    paymentIds,
  };

  const customerPhone = customer.primaryPhone || customer.phones?.[0];
  const customerEmail = customer.primaryEmail || customer.emails?.[0];

  if (customerPhone) {
    invoiceInput.phone = customerPhone;
  }

  if (customerEmail) {
    invoiceInput.email = customerEmail;
  }

  const invoice = await sendTRPCMessage({
    subdomain,
    pluginName: 'payment',
    method: 'mutation',
    module: 'payment',
    action: 'addInvoice',
    input: invoiceInput,
    defaultValue: null,
  });
  console.log('Created invoice:', invoice);
  if (!invoice || !invoice._id) {
    throw new Error('Failed to create invoice');
  }

  // Update membership purchase with invoiceId
  const updatedPurchase = await models.MembershipPurchase.updatePurchase(
    membershipPurchase._id,
    {
      invoiceId: invoice._id,
    },
  );

  return updatedPurchase;
}

export async function calculateMembershipExpiry(
  userId: string,
  planDuration: number,
  context: IContext,
): Promise<Date> {
  const { models } = context;

  const oneFitCustomer = await models.OneFitCustomer.getOneFitCustomer(
    userId,
  ).catch(() => null);

  const now = new Date();

  if (oneFitCustomer && oneFitCustomer.membershipExpiresAt) {
    const currentExpiry = new Date(oneFitCustomer.membershipExpiresAt);
    // If current membership is still active, stack the duration
    if (currentExpiry > now) {
      return new Date(
        currentExpiry.getTime() + planDuration * 24 * 60 * 60 * 1000,
      );
    }
  }

  // No active membership, start from now
  return new Date(now.getTime() + planDuration * 24 * 60 * 60 * 1000);
}

export async function activateMembershipPurchase(
  purchaseId: string,
  context: IContext,
) {
  const { models } = context;

  const purchase = await models.MembershipPurchase.getPurchase(purchaseId);

  if (purchase.status !== MembershipPurchaseStatus.PAID) {
    throw new Error('Membership purchase must be paid before activation');
  }

  if (purchase.activatedAt) {
    throw new Error('Membership purchase has already been activated');
  }

  const plan = await models.MembershipPlan.findOne({ _id: purchase.planId });
  if (!plan) {
    throw new Error('Membership plan not found');
  }

  // Calculate expiry date (stacking if active membership exists)
  const expiresAt = await calculateMembershipExpiry(
    purchase.userId,
    plan.duration,
    context,
  );

  // Update customer membership
  await updateCustomerMembership(
    purchase.userId,
    purchase.planId,
    expiresAt,
    context,
  );

  // Create credit transaction
  const { balanceAfter } = await createCreditTransactionForPurchase(
    purchase.userId,
    plan,
    context,
  );

  // Update customer credit balance
  await updateCustomerCreditBalance(
    purchase.userId,
    balanceAfter,
    plan.creditAmount,
    context,
  );

  // Update purchase with activation info
  const updatedPurchase = await models.MembershipPurchase.updatePurchase(
    purchaseId,
    {
      activatedAt: new Date(),
      expiresAt,
    },
  );

  return updatedPurchase;
}
