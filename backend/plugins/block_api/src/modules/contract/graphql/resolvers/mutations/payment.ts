import { IContext } from '~/connectionResolvers';

export const contractPaymentMutations = {
  blockAddPaymentTransaction: async (
    _parent: undefined,
    {
      paymentId,
      amount,
      date,
      note,
    }: {
      paymentId: string;
      amount: number;
      date?: Date;
      note?: string;
    },
    { models, user }: IContext,
  ) => {
    return models.ContractPayment.addTransaction(paymentId, {
      amount,
      date,
      note,
      createdBy: user?._id,
    });
  },

  blockUpdatePaymentTransaction: async (
    _parent: undefined,
    {
      _id,
      amount,
      date,
      note,
    }: { _id: string; amount?: number; date?: Date; note?: string },
    { models }: IContext,
  ) => {
    return models.ContractPayment.updateTransaction(_id, {
      amount,
      date,
      note,
    });
  },

  blockRemovePaymentTransaction: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.ContractPayment.removeTransaction(_id);
  },
};
