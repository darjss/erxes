export interface OneFitMembershipPlan {
  _id: string;
  createdAt: string;
  modifiedAt: string;
  name: string;
  description?: string;
  creditAmount: number;
  duration: number;
  price: number;
  isActive: boolean;
}

export interface OneFitMembershipPlanListResponse {
  list: OneFitMembershipPlan[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
}

export interface MembershipPlanFilters {
  searchValue?: string;
  isActive?: boolean;
}




