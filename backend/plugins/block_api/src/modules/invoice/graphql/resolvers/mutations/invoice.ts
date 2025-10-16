import { IContext } from '~/connectionResolvers';

export const invoiceMutations = {
  blockPayInvoice: async (
    _root,
    { _id, paidDate }: { _id: string; paidDate: Date },
    { models }: IContext,
  ) => {
    return await models.Invoice.updateOne(
      { _id },
      { $set: { paidDate: paidDate || new Date() } },
    );
  },
};
