import { Document } from 'mongoose';
import {
  BlockProjectPaymentPlanInterestType,
  BlockProjectPaymentPlanType,
} from '@/project/@types/payment';

export enum ContractPartyType {
  CUSTOMER = 'customer',
  COMPANY = 'company',
}

export interface IContractParty {
  type: ContractPartyType;
  id: string;
}

// Status is now an ObjectId reference to a ContractStatus document.
// Stage semantics (reserved/draft/signed/cancelled/lost) live on ContractStatus.type.

export interface IContractPaymentPlan {
  type: BlockProjectPaymentPlanType;
  downPaymentPercentage: number;
  interestPercentage: number;
  completionPaymentPercentage: number;
  discountPercentage: number;
  description: string;
  installment: number;
  frequency: string;
  penaltyPercentage: number;
  vatIncluded: boolean;
  paymentDates: number[];
  paymentDueDates?: Date[];
  firstPaymentDate?: Date;
  completionPaymentDate?: Date;
  completionPaymentDateLabel?: string;
  interestType: BlockProjectPaymentPlanInterestType;
}

export interface IContract {
  _id: string;
  number: string;
  unit: string;
  date: Date;
  amount: number;
  currency: string;
  status: string;
  startDate: Date;
  endDate: Date;
  endDateLabel?: string;
  party: IContractParty;
  paymentPlan: IContractPaymentPlan;
  user: string;
  description: string;
}

export interface IContractDocument extends IContract, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
