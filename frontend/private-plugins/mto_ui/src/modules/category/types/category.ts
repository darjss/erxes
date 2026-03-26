export interface MtoMultilingualString {
  en: string;
  mn: string;
}

export interface MtoMultilingualStringOptional {
  en?: string;
  mn?: string;
}

export interface MtoActivityCategory {
  _id: string;
  createdAt: string;
  modifiedAt: string;
  name: MtoMultilingualString;
  description?: MtoMultilingualStringOptional;
  parentId?: string;
  isActive: boolean;
  image?: string;
  icon?: string;
}

export interface CategoryFilters {
  searchValue?: string;
  name?: string;
  parentId?: string;
  isActive?: boolean;
}
