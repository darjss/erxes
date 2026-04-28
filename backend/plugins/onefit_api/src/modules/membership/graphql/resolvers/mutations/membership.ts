import { IContext } from '~/connectionResolvers';
import {
  IMembershipPlan,
  IMembershipSaleOption,
} from '@/membership/@types/membership';
import {
  createMembershipPurchaseInvoice,
  createMembershipPurchasesBulkInvoice,
  activateMembershipPurchase,
} from '../utils/membershipPurchase';
import { validateAndDiscount } from '@/promoCode/utils/validateAndDiscount';
import { Resolver } from 'erxes-api-shared/core-types';
import { requirePermission } from '~/utils/onefitPermissionCheck';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function validatePlanForNormal(
  planType: string | undefined,
  duration: number | undefined,
) {
  if (planType !== 'credit' && (duration == null || duration <= 0)) {
    throw new Error(
      'Duration is required and must be greater than 0 for normal plans',
    );
  }
}

function normalizeSaleOptions(
  saleOptions?: IMembershipSaleOption[],
): IMembershipSaleOption[] | undefined {
  if (!saleOptions) {
    return undefined;
  }

  const quantities = new Set<number>();
  const normalized = saleOptions.map((option, index) => {
    const { quantity, discountPercent, finalPrice } = option;
    const hasDiscountPercent = discountPercent != null;
    const hasFinalPrice = finalPrice != null;

    if (!Number.isInteger(quantity) || quantity < 2) {
      throw new Error(
        `Sale option #${index + 1} quantity must be an integer greater than or equal to 2`,
      );
    }

    if (quantities.has(quantity)) {
      throw new Error(`Duplicate sale option quantity: ${quantity}`);
    }

    quantities.add(quantity);

    if (
      (hasDiscountPercent && hasFinalPrice) ||
      (!hasDiscountPercent && !hasFinalPrice)
    ) {
      throw new Error(
        `Sale option #${index + 1} must define either discountPercent or finalPrice`,
      );
    }

    if (hasDiscountPercent && (discountPercent < 0 || discountPercent > 100)) {
      throw new Error(
        `Sale option #${index + 1} discountPercent must be between 0 and 100`,
      );
    }

    if (hasFinalPrice && finalPrice < 0) {
      throw new Error(
        `Sale option #${index + 1} finalPrice must be 0 or greater`,
      );
    }

    return {
      quantity,
      ...(hasDiscountPercent ? { discountPercent } : {}),
      ...(hasFinalPrice ? { finalPrice } : {}),
    };
  });

  return normalized.sort((a, b) => a.quantity - b.quantity);
}

export const membershipMutations: Record<string, Resolver> = {
  async oneFitMembershipPlanCreate(
    _root: undefined,
    doc: IMembershipPlan,
    context: IContext,
  ) {
    await requirePermission(context, 'membershipManage');
    const { models } = context;
    const planType = doc.planType ?? 'normal';
    validatePlanForNormal(planType, doc.duration);
    const saleOptions = normalizeSaleOptions(doc.saleOptions);
    return await models.MembershipPlan.createPlan({
      ...doc,
      saleOptions,
      planType: planType as 'normal' | 'credit',
    });
  },

  async oneFitMembershipPlanUpdate(
    _root: undefined,
    { _id, ...doc }: { _id: string } & Partial<IMembershipPlan>,
    context: IContext,
  ) {
    await requirePermission(context, 'membershipManage');
    const { models } = context;
    const existing = await models.MembershipPlan.findById(_id).lean();
    if (existing) {
      const planType = doc.planType ?? existing.planType ?? 'normal';
      const duration = doc.duration ?? existing.duration;
      validatePlanForNormal(planType, duration);
    }
    return await models.MembershipPlan.updatePlan(_id, {
      ...doc,
      ...(doc.saleOptions
        ? { saleOptions: normalizeSaleOptions(doc.saleOptions) }
        : {}),
    });
  },

  async oneFitMembershipPlansRemove(
    _root: undefined,
    { ids }: { ids: string[] },
    context: IContext,
  ) {
    await requirePermission(context, 'membershipManage');
    const { models } = context;
    return await models.MembershipPlan.removePlans(ids);
  },

  async oneFitMembershipPurchaseCreate(
    _root: undefined,
    {
      userId,
      planId,
      quantity,
      promoCode,
      promoCodeId,
      removePreviousCredits,
    }: {
      userId: string;
      planId: string;
      quantity?: number;
      promoCode?: string;
      promoCodeId?: string;
      removePreviousCredits?: boolean;
    },
    context: IContext,
  ) {
    await requirePermission(context, 'membershipPurchaseManage');
    return await createMembershipPurchaseInvoice(userId, planId, context, {
      quantity,
      promoCode,
      promoCodeId,
      removePreviousCredits,
    });
  },

  async oneFitMembershipPurchasesBulkCreate(
    _root: undefined,
    {
      userIds,
      planId,
      quantity,
      companyId,
      promoCode,
      promoCodeId,
      removePreviousCredits,
    }: {
      userIds: string[];
      planId: string;
      quantity?: number;
      companyId?: string;
      promoCode?: string;
      promoCodeId?: string;
      removePreviousCredits?: boolean;
    },
    context: IContext,
  ) {
    await requirePermission(context, 'membershipPurchaseManage');

    if (!userIds.length) {
      return [];
    }

    return await createMembershipPurchasesBulkInvoice(planId, context, {
      userIds,
      quantity,
      promoCode,
      promoCodeId,
      companyId,
      removePreviousCredits,
    });
  },

  async oneFitMembershipPurchaseActivate(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    await requirePermission(context, 'membershipPurchaseManage');
    return await activateMembershipPurchase(_id, context);
  },

  async oneFitMembershipPurchaseCompanyUpdate(
    _root: undefined,
    { _id, companyId }: { _id: string; companyId?: string },
    context: IContext,
  ) {
    await requirePermission(context, 'membershipPurchaseManage');
    const { models } = context;

    await models.MembershipPurchase.getPurchase(_id);

    return await models.MembershipPurchase.updatePurchase(_id, {
      companyId: companyId || undefined,
    });
  },

  async cpOneFitMembershipPurchaseCreate(
    _root: undefined,
    {
      planId,
      quantity,
      promoCode,
      promoCodeId,
      removePreviousCredits,
    }: {
      planId: string;
      quantity?: number;
      promoCode?: string;
      promoCodeId?: string;
      removePreviousCredits?: boolean;
    },
    context: IContext,
  ) {
    const { cpUser } = context;
    if (!cpUser) {
      throw new Error('Client portal user required');
    }

    const userId = cpUser.erxesCustomerId || cpUser._id;

    return await createMembershipPurchaseInvoice(userId, planId, context, {
      quantity,
      promoCode,
      promoCodeId,
      removePreviousCredits,
    });
  },

  async cpOneFitMembershipPurchaseActivate(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    const { models, cpUser } = context;
    if (!cpUser) {
      throw new Error('Client portal user required');
    }

    const userId = cpUser.erxesCustomerId || cpUser._id;

    // Verify ownership
    const purchase = await models.MembershipPurchase.getPurchase(_id);

    if (purchase.userId !== userId) {
      throw new Error('You do not have permission to activate this purchase');
    }

    return await activateMembershipPurchase(_id, context);
  },

  async cpOneFitMembershipHoldStart(
    _root: undefined,
    { holdDays }: { holdDays: number },
    context: IContext,
  ) {
    const { models, cpUser } = context;
    if (!cpUser) {
      throw new Error('Client portal user required');
    }
    const userId = cpUser.erxesCustomerId || cpUser._id;
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

  async cpOneFitMembershipHoldCancel(
    _root: undefined,
    _args: undefined,
    context: IContext,
  ) {
    const { models, cpUser } = context;
    if (!cpUser) {
      throw new Error('Client portal user required');
    }
    const userId = cpUser.erxesCustomerId || cpUser._id;
    const customer = await models.OneFitCustomer.getOneFitCustomer(userId);
    if (!customer) {
      throw new Error('Customer not found');
    }
    if (!customer.isMembershipOnHold) {
      throw new Error('Membership is not on hold');
    }
    return await models.OneFitCustomer.cancelMembershipHold(userId);
  },

  async cpOneFitMembershipCheckPromoDiscount(
    _root: undefined,
    {
      planId,
      promoCode,
      promoCodeId,
    }: {
      planId: string;
      promoCode?: string;
      promoCodeId?: string;
    },
    context: IContext,
  ) {
    if (!context.cpUser) {
      return {
        valid: false,
        error: 'Client portal user required',
      };
    }

    if (!promoCode && !promoCodeId) {
      return {
        valid: false,
        error: 'Provide promoCode or promoCodeId',
      };
    }

    if (promoCode && promoCodeId) {
      return {
        valid: false,
        error: 'Provide only one of promoCode or promoCodeId',
      };
    }

    const { models } = context;
    const plan = await models.MembershipPlan.findOne({ _id: planId });
    if (!plan) {
      return {
        valid: false,
        error: 'Membership plan not found',
      };
    }

    try {
      const result = await validateAndDiscount(context, {
        promoCode,
        promoCodeId,
        originalPrice: plan.price,
      });
      return {
        valid: true,
        originalPrice: plan.price,
        discountedAmount: result.discountedAmount,
        promoCodeId: result.promoCodeId,
        discountType: result.discountType,
        value: result.value,
      };
    } catch (err) {
      return {
        valid: false,
        error: err instanceof Error ? err.message : 'Invalid promo code',
      };
    }
  },
};

membershipMutations.cpOneFitMembershipHoldStart.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};

membershipMutations.cpOneFitMembershipHoldCancel.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};

membershipMutations.cpOneFitMembershipPurchaseCreate.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};

membershipMutations.cpOneFitMembershipPurchaseActivate.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};

membershipMutations.cpOneFitMembershipCheckPromoDiscount.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};
