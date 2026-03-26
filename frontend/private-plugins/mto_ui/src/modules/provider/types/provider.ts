export enum ProviderStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface MultilingualString {
  en: string;
  mn: string;
}

export interface MultilingualStringOptional {
  en?: string;
  mn?: string;
}

export interface MtoContactInfo {
  phone: string;
  email: string;
  website?: string;
}

export interface MtoActivityCategory {
  _id: string;
  name: MultilingualString;
}

export interface MtoProvider {
  _id: string;
  createdAt: string;
  modifiedAt: string;
  instanceId?: string;
  businessName: MultilingualString;
  description?: MultilingualStringOptional;
  contactInfo: MtoContactInfo;
  facilities?: string[];
  categoryIds: string[];
  categories?: MtoActivityCategory[];
  singleProviderLimit?: number;
  status: string;
  rejectionReason?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedBy?: string;
  isActive: boolean;
  icon?: string;
  coverImages?: string[];
}

export interface MtoProviderListResponse {
  list: MtoProvider[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
}

export interface ProviderFilters {
  searchValue?: string;
  status?: string;
  categoryId?: string;
  isActive?: boolean;
}
