import { CurrencyCode } from 'erxes-ui';

export interface IOfferPaymentPlan {
  type?: string;
  downPaymentPercentage?: number;
  downPaymentAmount?: number;
  interestPercentage?: number;
  interestType?: string;
  discountPercentage?: number;
  installment?: number;
  frequency?: string;
  penaltyPercentage?: number;
  barterPercentage?: number;
  barterAmount?: number;
  completionPaymentPercentage?: number;
  completionPaymentAmount?: number;
  roundedInstallmentAmount?: number;
  paymentDates?: number[];
  firstPaymentDate?: string;
  downPaymentDate?: string;
  vatIncluded?: boolean;
}

export interface IOffer {
  _id: string;
  number: string;
  unit: string;
  amount: number;
  amountType: string;
  status: 'draft' | 'sent';
  currency: CurrencyCode;
  date: string;
  endDate: string;
  party: {
    type: string;
    id: string;
  };
  paymentPlan?: IOfferPaymentPlan;
  user: string;
}

export interface IOfferInput {
  unit: string;
  amount: number;
  amountType: string;
  currency: CurrencyCode;
  date?: Date;
  endDate?: Date;
  party?: { type: string; id: string };
  paymentPlan?: IOfferPaymentPlan;
  user?: string;
}
