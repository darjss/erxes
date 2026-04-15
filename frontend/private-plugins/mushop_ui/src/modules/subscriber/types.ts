import { IPageInfo } from 'ui-modules';

export interface ISubscriber {
  _id: string;
  cpUserId: string;
  erxesCustomerId?: string;
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
