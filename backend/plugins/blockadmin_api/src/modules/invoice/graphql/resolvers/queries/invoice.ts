import { IContext } from '~/connectionResolvers';

export const invoiceQueries = {
  blockAdminGetInvoice: async (
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return await models.Invoice.findOne({ _id });
  },

  blockAdminGetInvoices: async (
    _root,
    { itemId }: { itemId: string },
    { models }: IContext,
  ) => {
    return await models.Invoice.find({ itemId });
  },
};
