import { IContext } from '~/connectionResolvers';
import { IMembershipPlan } from '@/membership/@types/membership';
import {
  createMembershipPurchaseInvoice,
  activateMembershipPurchase,
} from '../utils/membershipPurchase';
import { Resolver } from 'erxes-api-shared/core-types';

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

export const membershipMutations: Record<string, Resolver> = {
  async oneFitMembershipPlanCreate(
    _root: undefined,
    doc: IMembershipPlan,
    { models }: IContext,
  ) {
    const planType = doc.planType ?? 'normal';
    validatePlanForNormal(planType, doc.duration);
    return await models.MembershipPlan.createPlan({
      ...doc,
      planType: planType as 'normal' | 'credit',
    });
  },

  async oneFitMembershipPlanUpdate(
    _root: undefined,
    { _id, ...doc }: { _id: string } & Partial<IMembershipPlan>,
    { models }: IContext,
  ) {
    const existing = await models.MembershipPlan.findById(_id).lean();
    if (existing) {
      const planType = doc.planType ?? existing.planType ?? 'normal';
      const duration = doc.duration ?? existing.duration;
      validatePlanForNormal(planType, duration);
    }
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
    {
      userId,
      planId,
      promoCode,
      promoCodeId,
    }: {
      userId: string;
      planId: string;
      promoCode?: string;
      promoCodeId?: string;
    },
    context: IContext,
  ) {
    return await createMembershipPurchaseInvoice(userId, planId, context, {
      promoCode,
      promoCodeId,
    });
  },

  async oneFitMembershipPurchaseActivate(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    return await activateMembershipPurchase(_id, context);
  },

  async cpOneFitMembershipPurchaseCreate(
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
    const { cpUser } = context;
    if (!cpUser) {
      throw new Error('Client portal user required');
    }

    const userId = cpUser.erxesCustomerId || cpUser._id;

    return await createMembershipPurchaseInvoice(userId, planId, context, {
      promoCode,
      promoCodeId,
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
