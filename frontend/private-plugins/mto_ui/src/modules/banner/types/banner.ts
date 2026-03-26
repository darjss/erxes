export enum BannerType {
  ADULT = 'adult',
  CHILD = 'child',
}

export enum BannerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface MtoBanner {
  _id: string;
  createdAt: string;
  modifiedAt: string;
  image: string;
  providerId: string;
  type: string;
  status: string;
}

export interface MtoBannerListResponse {
  list: MtoBanner[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
}

export interface BannerFilters {
  providerId?: string;
  type?: string;
  status?: string;
}
