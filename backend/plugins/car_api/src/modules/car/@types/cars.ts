import { IAttachment } from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';

export interface ICustomFieldValue {
  field: string;
  value: any;
  stringValue?: string;
  numberValue?: number;
  dateValue?: Date;
  extraValue?: string;
  locationValue?: {
    type: 'Point';
    coordinates: number[];
  };
}

export interface ICar {
  ownerId?: string;
  mergedIds?: string[];
  description?: string;
  tagIds?: string[];
  plateNumber?: string;
  vinNumber?: string;
  colorCode?: string;
  categoryId?: string;
  bodyType?: string;
  fuelType?: string;
  gearBox?: string;
  vintageYear?: number;
  importYear?: number;
  status?: string;
  attachment?: IAttachment;
  customFieldsData?: ICustomFieldValue[];
  searchText?: string;
}

export interface ICarDocument extends ICar, Document {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface ICarCategory {
  name: string;
  code: string;
  order?: string;
  parentId?: string;
  description?: string;
  image?: IAttachment;
  secondaryImages?: IAttachment[];
  productCategoryId?: string;
}

export interface ICarCategoryDocument extends ICarCategory, Document {
  _id: string;
  createdAt: Date;
}

export interface ICarsFilter {
  page?: number;
  perPage?: number;
  ids?: string[];
  excludeIds?: boolean;
  tag?: string;
  segment?: string;
  segmentData?: string;
  categoryId?: string;
  searchValue?: string;
  sortField?: string;
  sortDirection?: 1 | -1;
  brand?: string;
  conformityMainType?: string;
  conformityMainTypeId?: string;
  conformityRelType?: string;
  conformityIsRelated?: boolean;
  conformityIsSaved?: boolean;
}
