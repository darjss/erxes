import { IContext } from '~/connectionResolvers';
import { INewsPaymentPlan } from '~/modules/news/@types/payment';

export const paymentMutations = {
  btkCreateNewsPaymentPlan: async (
    _parent: undefined,
    { input }: { input: INewsPaymentPlan },
    { models }: IContext,
  ) => {
    return models.NewsPaymentPlan.createNewsPaymentPlan({ input });
  },

  btkUpdateNewsPaymentPlan: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: INewsPaymentPlan },
    { models }: IContext,
  ) => {
    return models.NewsPaymentPlan.updateNewsPaymentPlan({ _id, input });
  },
};

