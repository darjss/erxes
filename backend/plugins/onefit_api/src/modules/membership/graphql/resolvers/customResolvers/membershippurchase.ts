import { IMembershipPurchaseDocument } from '@/membership/@types/membershippurchase';
import { IContext } from '~/connectionResolvers';

const resolvers = {
  OneFitMembershipPurchase: {
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
    invoice: async (
      purchase: IMembershipPurchaseDocument,
      _params: undefined,
      _context: IContext,
    ) => {
      if (!purchase.invoiceId) {
        return null;
      }
      // Use GraphQL federation to resolve the Invoice
      return { __typename: 'Invoice', _id: purchase.invoiceId };
    },
  },
};

export default resolvers;
