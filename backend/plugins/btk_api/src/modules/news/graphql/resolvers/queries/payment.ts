import { IContext } from '~/connectionResolvers';

export const paymentQueries = {
  btkGetNewsPaymentPlan: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.NewsPaymentPlan.findOne({ _id });
  },

  btkGetNewsPaymentPlans: async (
    _parent: undefined,
    { news }: { news: string },
    { models }: IContext,
  ) => {
    return models.NewsPaymentPlan.find({ news });
  },
};
