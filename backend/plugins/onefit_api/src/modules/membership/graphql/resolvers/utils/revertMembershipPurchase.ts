import { IContext } from '~/connectionResolvers';
import {
  CreditSource,
  CreditTransactionType,
} from '@/membership/@types/credittransaction';
import {
  IMembershipPurchaseDocument,
  MembershipPurchaseStatus,
} from '@/membership/@types/membershippurchase';
import { isCreditOnlyPlan } from './membershipPurchase';

const DAY_MS = 24 * 60 * 60 * 1000;

async function revertActivationCredits(
  purchase: IMembershipPurchaseDocument,
  plan: { creditAmount: number; name?: string },
  context: IContext,
) {
  const { models } = context;
  const creditAmount = plan.creditAmount ?? 0;

  if (creditAmount <= 0) {
    return;
  }

  const balanceBefore = await models.CreditTransaction.getUserBalance(
    purchase.userId,
  );
  const balanceAfter = Math.max(0, balanceBefore - creditAmount);

  await models.CreditTransaction.createTransaction({
    userId: purchase.userId,
    amount: -creditAmount,
    transactionType: CreditTransactionType.REFUND,
    source: CreditSource.INDIVIDUAL,
    description: `Reverted membership purchase deletion: ${plan.name ?? 'membership'}`,
    balanceAfter,
  });

  const oneFitCustomer = await models.OneFitCustomer.getOneFitCustomer(
    purchase.userId,
  ).catch(() => null);

  if (oneFitCustomer) {
    await models.OneFitCustomer.updateCreditBalanceForRefund(
      purchase.userId,
      balanceAfter,
      creditAmount,
    );
  }
}

async function revertActivationMembershipExpiry(
  purchase: IMembershipPurchaseDocument,
  plan: { duration?: number },
  context: IContext,
) {
  const { models } = context;
  const durationDays = plan.duration ?? 0;

  if (durationDays <= 0) {
    return;
  }

  const oneFitCustomer = await models.OneFitCustomer.getOneFitCustomer(
    purchase.userId,
  ).catch(() => null);

  if (!oneFitCustomer || !oneFitCustomer.membershipExpiresAt) {
    return;
  }

  const currentExpiry = new Date(oneFitCustomer.membershipExpiresAt);
  const newExpiresAt = new Date(
    currentExpiry.getTime() - durationDays * DAY_MS,
  );

  const planIdToSet =
    newExpiresAt.getTime() <= Date.now()
      ? oneFitCustomer.membershipPlanId
      : oneFitCustomer.membershipPlanId || purchase.planId;

  await models.OneFitCustomer.updateMembership(
    purchase.userId,
    planIdToSet || purchase.planId,
    newExpiresAt,
  );
}

async function decrementPromoCodeUsage(
  purchase: IMembershipPurchaseDocument,
  context: IContext,
) {
  const { models } = context;

  if (!purchase.promoCodeId) {
    return;
  }

  if (purchase.status !== MembershipPurchaseStatus.PAID) {
    return;
  }

  await models.PromoCode.updateOne(
    { _id: purchase.promoCodeId, usedCount: { $gt: 0 } },
    { $inc: { usedCount: -1 } },
  );
}

export async function revertMembershipPurchaseSideEffects(
  purchase: IMembershipPurchaseDocument,
  context: IContext,
): Promise<void> {
  const { models } = context;

  const plan = await models.MembershipPlan.findOne({
    _id: purchase.planId,
  }).catch(() => null);

  try {
    if (purchase.activatedAt && plan) {
      await revertActivationCredits(purchase, plan, context);

      if (!isCreditOnlyPlan(plan)) {
        await revertActivationMembershipExpiry(purchase, plan, context);
      }
    }
  } catch (err) {
    console.warn(
      `[onefit] Failed to revert activation side-effects for membership purchase ${purchase._id}`,
      err,
    );
  }

  try {
    await decrementPromoCodeUsage(purchase, context);
  } catch (err) {
    console.warn(
      `[onefit] Failed to decrement promo code usage for membership purchase ${purchase._id}`,
      err,
    );
  }
}
