export interface OneFitActivityCategory {
  _id: string;
  createdAt: string;
  modifiedAt: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
}

export interface OneFitActivityCategoryListResponse {
  list: OneFitActivityCategory[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
}

export interface CategoryFilters {
  searchValue?: string;
  name?: string;
  parentId?: string;
  isActive?: boolean;
}

