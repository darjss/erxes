import { IInvoice, IInvoiceDocument } from '@/invoice/@types/invoice';
import { invoiceSchema } from '@/invoice/db/definitions/invoice';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IInvoiceModel extends Model<IInvoiceDocument> {
  getInvoice(subdomain: string, entityId: string): Promise<IInvoiceDocument>;
  createInvoice(doc: IInvoice): Promise<IInvoiceDocument>;
  updateInvoice(
    subdomain: string,
    entityId: string,
    doc: any,
  ): Promise<IInvoiceDocument>;
}

export const loadInvoiceClass = (models: IModels) => {
  class Invoice {
    public static async getInvoice(subdomain: string, entityId: string) {
      const invoice = await models.Invoice.findOne({
        subdomain,
        entityId,
      }).lean();

      if (!invoice) {
        throw new Error('Invoice not found');
      }

      return invoice;
    }

    public static async createInvoice(doc: IInvoice) {
      return models.Invoice.create(doc);
    }

    public static async updateInvoice(
      subdomain: string,
      entityId: string,
      doc: any,
    ) {
      const { _id } = await models.Invoice.getInvoice(subdomain, entityId);

      return models.Invoice.findOneAndUpdate(
        { _id },
        { $set: doc },
        { new: true },
      );
    }
  }

  invoiceSchema.loadClass(Invoice);

  return invoiceSchema;
};
