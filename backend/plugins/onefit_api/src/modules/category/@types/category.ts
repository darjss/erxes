import { Document } from 'mongoose';
import {
  IMultilingualString,
  IMultilingualStringOptional,
} from '@/activity-type/@types/activityType';

export interface IActivityCategory {
  name: IMultilingualString;
  description?: IMultilingualStringOptional;
  parentId?: string;
  isActive?: boolean;
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface IActivityCategoryDocument extends Document, IActivityCategory {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}
