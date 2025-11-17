import { IContext } from '~/connectionResolvers';
import { IProjectPaymentPlan } from '@/project/@types/payment';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const paymentMutations = {
  btkCreateProjectPaymentPlan: async (
    _parent: undefined,
    { input }: { input: IProjectPaymentPlan },
    { models }: IContext,
  ) => {
    return models.ProjectPaymentPlan.createProjectPaymentPlan({ input });
  },

  btkUpdateProjectPaymentPlan: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: IProjectPaymentPlan },
    { models }: IContext,
  ) => {
    return models.ProjectPaymentPlan.updateProjectPaymentPlan({ _id, input });
  },
};

requireLogin(paymentMutations, 'btkCreateProjectPaymentPlan');
requireLogin(paymentMutations, 'btkUpdateProjectPaymentPlan');
