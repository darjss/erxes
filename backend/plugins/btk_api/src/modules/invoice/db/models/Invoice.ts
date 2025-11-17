import { Model } from 'mongoose';
import { IInvoice } from '@/invoice/@types/invoice';
import { IModels } from '~/connectionResolvers';
import { IInvoiceDocument } from '@/invoice/@types/invoice';
import { invoiceSchema } from '@/invoice/db/definitions/invoice';

export interface IInvoiceModel extends Model<IInvoiceDocument> {
  createInvoice(doc: IInvoice): Promise<IInvoiceDocument>;
  updateInvoice(_id: string, doc: any): Promise<IInvoiceDocument>;
}

export const loadInvoiceClass = (models: IModels) => {
  class Invoice {
    public static async createInvoice(doc: IInvoice) {
      const invoice = await models.Invoice.create(doc);
      return invoice;
    }

    public static async updateInvoice(_id: string, doc: any) {
      const invoice = await models.Invoice.updateOne({ _id }, { $set: doc });
      return invoice;
    }
  }

  invoiceSchema.loadClass(Invoice);

  return invoiceSchema;
};
