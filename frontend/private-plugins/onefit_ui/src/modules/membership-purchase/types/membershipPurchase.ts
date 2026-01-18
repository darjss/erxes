import { OneFitMembershipPlan } from '~/modules/membership/types/membership';

export interface OneFitMembershipPurchaseUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  primaryEmail?: string;
  primaryPhone?: string;
}

export interface OneFitMembershipPurchase {
  _id: string;
  createdAt: string;
  modifiedAt: string;
  userId: string;
  user?: OneFitMembershipPurchaseUser;
  planId: string;
  status: 'pending' | 'paid' | 'cancelled' | 'failed';
  purchasedAt: string;
  paidAt?: string;
  activatedAt?: string;
  expiresAt?: string;
  amount: number;
  invoiceId?: string;
  plan?: OneFitMembershipPlan;
  invoice?: any;
}

export interface OneFitMembershipPurchaseListResponse {
  list: OneFitMembershipPurchase[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
}

export interface MembershipPurchaseFilters {
  userId?: string;
  status?: string;
  planId?: string;
}

