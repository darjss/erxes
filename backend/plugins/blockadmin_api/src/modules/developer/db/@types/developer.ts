import {
  IAddress,
  ICursorPaginateParams,
  IListParams,
} from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';
import { IBlock } from '~/types';

export interface IBlockDeveloperSocialLink {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
}
export interface IBlockDeveloper extends IBlock {
  name: string;
  description: string;
  about: string;
  logo: string;
  website: string;
  email: string;
  phone: string;
  address: IAddress;
  dateFounded: Date;
  primaryPhone: string;
  phones: string[];
  socialLinks: IBlockDeveloperSocialLink;
  isVerified: boolean;
  coverImage: string;
}

export interface IBlockDeveloperDocument extends IBlockDeveloper, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeveloperQueryParams
  extends ICursorPaginateParams,
    IListParams {
  isVerified?: string;
  developerId?: string;
}
