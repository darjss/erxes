export enum ProviderStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface OneFitLocation {
  address: string;
  city: string;
  district?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface OneFitContactInfo {
  phone: string;
  email: string;
  website?: string;
}

export interface OneFitProvider {
  _id: string;
  createdAt: string;
  modifiedAt: string;
  businessName: string;
  description?: string;
  location: OneFitLocation;
  contactInfo: OneFitContactInfo;
  facilities?: string[];
  categoryIds: string[];
  status: string;
  rejectionReason?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedBy?: string;
  isActive: boolean;
}

export interface OneFitProviderListResponse {
  list: OneFitProvider[];
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
