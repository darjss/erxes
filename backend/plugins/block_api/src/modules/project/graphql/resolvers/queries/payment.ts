import { IContext } from '~/connectionResolvers';

export const paymentQueries = {
  blockGetProjectPaymentPlan: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.ProjectPaymentPlan.findOne({ _id });
  },

  blockGetProjectPaymentPlans: async (
    _parent: undefined,
    { project }: { project: string },
    { models }: IContext,
  ) => {
    return models.ProjectPaymentPlan.find({ project });
  },
};

