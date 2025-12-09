export enum GenderRestriction {
  MALE = 'male',
  FEMALE = 'female',
  MIXED = 'mixed',
}

export interface OneFitActivityType {
  _id: string;
  createdAt: string;
  modifiedAt: string;
  providerId: string;
  provider?: {
    _id: string;
    businessName: string;
  };
  name: string;
  description?: string;
  creditCost: number;
  duration: number;
  genderRestriction: GenderRestriction;
  categoryIds: string[];
  categories?: Array<{
    _id: string;
    name: string;
  }>;
  isActive: boolean;
  cancellationDeadline?: number;
}

export interface OneFitActivityTypeListResponse {
  list: OneFitActivityType[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
}

export interface ActivityTypeFilters {
  searchValue?: string;
  providerId?: string;
  categoryId?: string;
  genderRestriction?: GenderRestriction;
  isActive?: boolean;
}







