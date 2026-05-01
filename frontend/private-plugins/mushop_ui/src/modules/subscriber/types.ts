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
  createdAt?: string;
  updatedAt?: string;
}

export interface ISubscriberList {
  list: ISubscriber[];
  pageInfo: IPageInfo;
  totalCount?: number;
}
