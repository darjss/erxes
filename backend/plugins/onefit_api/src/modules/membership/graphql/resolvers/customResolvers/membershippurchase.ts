import { IMembershipPurchaseDocument } from '@/membership/@types/membershippurchase';
import { IMembershipPlanDocument } from '@/membership/@types/membership';
import { IContext } from '~/connectionResolvers';
import { sendTRPCMessage } from 'erxes-api-shared/utils';

const resolvers = {
  OneFitMembershipPlan: {
    saleOptions: (plan: IMembershipPlanDocument) => {
      if (!Array.isArray(plan.saleOptions)) {
        return [];
      }

      return plan.saleOptions
        .filter(
          (option) =>
            option &&
            Number.isInteger(option.quantity) &&
            option.quantity >= 2 &&
            ((option.discountPercent != null && option.finalPrice == null) ||
              (option.finalPrice != null && option.discountPercent == null)),
        )
        .map((option) => ({
          quantity: option.quantity,
          ...(option.discountPercent != null
            ? { discountPercent: option.discountPercent }
            : {}),
          ...(option.finalPrice != null ? { finalPrice: option.finalPrice } : {}),
        }));
    },
  },
  OneFitMembershipPurchase: {
    user: async (
      purchase: IMembershipPurchaseDocument,
      _params: undefined,
      { models }: IContext,
    ) => {
      if (!purchase.userId) {
        return null;
      }
      return await models.OneFitCustomer.findOne({ _id: purchase.userId });
    },
    company: async (
      purchase: IMembershipPurchaseDocument,
      _params: undefined,
      context: IContext,
    ) => {
      const { subdomain } = context;

      if (purchase.companyId) {
        return await sendTRPCMessage({
          subdomain,
          pluginName: 'core',
          method: 'query',
          module: 'companies',
          action: 'findOne',
          input: {
            query: { _id: purchase.companyId },
          },
          defaultValue: null,
        });
      }

      return null;
    },
    plan: async (
      purchase: IMembershipPurchaseDocument,
      _params: undefined,
      { models }: IContext,
    ) => {
      if (!purchase.planId) {
        return null;
      }
      return await models.MembershipPlan.findOne({ _id: purchase.planId });
    },
    promoCode: async (
      purchase: IMembershipPurchaseDocument,
      _params: undefined,
      { models }: IContext,
    ) => {
      if (!purchase.promoCodeId) {
        return null;
      }
      return await models.PromoCode.findOne({ _id: purchase.promoCodeId });
    },
    invoice: async (
      purchase: IMembershipPurchaseDocument,
      _params: undefined,
      context: IContext,
    ) => {
      if (!purchase.invoiceId) {
        return null;
      }

      const { subdomain } = context;

      try {
        const invoice = await sendTRPCMessage({
          subdomain,
          pluginName: 'payment',
          method: 'query',
          module: 'payment',
          action: 'getInvoiceWithTransactions',
          input: {
            _id: purchase.invoiceId,
          },
          defaultValue: null,
        });

        if (!invoice) {
          return null;
        }

        return invoice;
      } catch (error) {
        return null;
      }
    },
  },
};

export default resolvers;
