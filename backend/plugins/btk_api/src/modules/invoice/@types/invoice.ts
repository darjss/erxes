export enum InvoiceStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
}

export enum InvoiceItemType {
  CONTRACT = 'contract',
  OFFER = 'offer',
}

export interface IInvoice {
  amount: number;
  date: Date;
  lateDays?: number;
  status: string;
  number: number;
  itemId: string;
  itemType: InvoiceItemType;
  paidDate?: Date;
  customDate?: string;
  description?: string;
}

export interface IInvoiceDocument extends IInvoice, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
