import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

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

requireLogin(paymentQueries, 'btkAdminGetNewsPaymentPlan');
requireLogin(paymentQueries, 'btkAdminGetNewsPaymentPlans');
