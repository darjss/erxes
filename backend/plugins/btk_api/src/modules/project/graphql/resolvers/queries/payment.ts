import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const paymentQueries = {
  btkGetProjectPaymentPlan: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.ProjectPaymentPlan.findOne({ _id });
  },

  btkGetProjectPaymentPlans: async (
    _parent: undefined,
    { project }: { project: string },
    { models }: IContext,
  ) => {
    return models.ProjectPaymentPlan.find({ project });
  },
};

requireLogin(paymentQueries, 'btkGetProjectPaymentPlan');
requireLogin(paymentQueries, 'btkGetProjectPaymentPlans');
