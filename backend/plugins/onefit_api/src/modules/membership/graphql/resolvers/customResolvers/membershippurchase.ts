import { IMembershipPurchaseDocument } from '@/membership/@types/membershippurchase';
import { IContext } from '~/connectionResolvers';
import { sendTRPCMessage } from 'erxes-api-shared/utils';

const resolvers = {
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
