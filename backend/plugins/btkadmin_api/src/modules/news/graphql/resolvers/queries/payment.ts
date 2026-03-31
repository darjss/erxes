import { IContext } from '~/connectionResolvers';

export const paymentQueries = {
  btkAdminGetNewsPaymentPlan: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.NewsPaymentPlan.findOne({ _id });
  },

  btkAdminGetNewsPaymentPlans: async (
    _parent: undefined,
    { news }: { news: string },
    { models }: IContext,
  ) => {
    return models.NewsPaymentPlan.find({ news });
  },
};
