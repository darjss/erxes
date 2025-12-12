export interface OneFitMultilingualString {
  en: string;
  mn: string;
}

export interface OneFitMultilingualStringOptional {
  en?: string;
  mn?: string;
}

export interface OneFitActivityCategory {
  _id: string;
  createdAt: string;
  modifiedAt: string;
  name: OneFitMultilingualString;
  description?: OneFitMultilingualStringOptional;
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
