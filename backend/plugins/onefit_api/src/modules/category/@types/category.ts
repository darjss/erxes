import { Document } from 'mongoose';

export interface IActivityCategory {
  name: string; // 'Kids' or 'Adults'
  description?: string;
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
