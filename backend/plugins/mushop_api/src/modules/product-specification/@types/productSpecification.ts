import { Document } from 'mongoose';

export interface IMushopProductSpecification {
  productId: string;
  // Minimum order quantity. More specification fields added additively later.
  moq?: number;
  // Yuan purchase cost; unitPrice is derived as cnyCost * exchange rate.
  cnyCost?: number;
  // Margin and prepayment as a percentage of the product's unitPrice.
  profitPercent?: number;
  prepaymentPercent?: number;
}

export interface IMushopProductSpecificationDocument
  extends IMushopProductSpecification,
    Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
