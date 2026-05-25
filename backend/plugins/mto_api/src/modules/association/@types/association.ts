import { Document } from 'mongoose';
import { IMultilingualString } from '@/provider/@types/provider';

export interface IAssociation {
  name: IMultilingualString;
  logo?: string;
  parentId?: string;
  isActive?: boolean;
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface IAssociationDocument extends Document, IAssociation {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}
