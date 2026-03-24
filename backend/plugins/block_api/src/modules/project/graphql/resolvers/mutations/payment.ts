import { IContext } from '~/connectionResolvers';
import { IProjectPaymentPlan } from '@/project/@types/payment';

export const paymentMutations = {
  blockCreateProjectPaymentPlan: async (
    _parent: undefined,
    { input }: { input: IProjectPaymentPlan },
    { models }: IContext,
  ) => {
    return models.ProjectPaymentPlan.createProjectPaymentPlan({ input });
  },

  blockUpdateProjectPaymentPlan: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: IProjectPaymentPlan },
    { models }: IContext,
  ) => {
    return models.ProjectPaymentPlan.updateProjectPaymentPlan({ _id, input });
  },
};

