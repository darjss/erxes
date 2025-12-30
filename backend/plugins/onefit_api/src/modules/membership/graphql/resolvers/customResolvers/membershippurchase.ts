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
  },
};

export default resolvers;

