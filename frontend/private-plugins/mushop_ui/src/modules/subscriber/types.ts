import { IPageInfo } from 'ui-modules';

export interface ISubscriptionPlan {
  _id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  durationMonths: number;
  isActive?: boolean;
}

export interface ISubscriber {
  _id: string;
  customerId: string;
  planId?: string;
  plan?: ISubscriptionPlan;
  status?: string;
  startDate?: string;
  endDate?: string;
  amount?: number;
  currency?: string;
  invoiceId?: string;
  customer?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    primaryEmail?: string;
    primaryPhone?: string;
    avatar?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ISubscriberList {
  list: ISubscriber[];
  pageInfo: IPageInfo;
  totalCount?: number;
}

export interface IPaymentMethod {
  _id: string;
  name: string;
  kind: string;
  status?: string | null;
}
