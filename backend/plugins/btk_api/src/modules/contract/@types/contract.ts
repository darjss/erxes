import {
  BtkProjectPaymentPlanInterestType,
  BtkProjectPaymentPlanType,
} from '@/project/@types/payment';

export enum ContractPartyType {
  CUSTOMER = 'customer',
  COMPANY = 'company',
}

export enum ContractAmountType {
  PER_SIZE = 'perSize',
  PER_UNIT = 'perUnit',
}

export interface IContractParty {
  type: ContractPartyType;
  id: string;
}

export enum ContractStatus {
  DRAFT = 'draft',
  SIGNED = 'signed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export interface IContractPaymentPlan {
  type: BtkProjectPaymentPlanType;
  downPaymentPercentage: number;
  interestPercentage: number;
  advancePaymentPercentage: number;
  discountPercentage: number;
  description: string;
  installment: number;
  frequency: string;
  penaltyPercentage: number;
  vatIncluded: boolean;
  paymentDates: number[];
  interestType: BtkProjectPaymentPlanInterestType;
}

export interface IContract {
  _id: string;
  number: string;
  unit: string;
  date: Date;
  amount: number;
  amountType: ContractAmountType;
  currency: string;
  status: ContractStatus;
  startDate: Date;
  endDate: Date;
  isLifeTime: boolean;
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
