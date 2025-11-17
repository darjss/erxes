import { IAddress } from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';

export interface ICompanySocialLink {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
}
export interface ICompany {
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
  socialLinks: ICompanySocialLink;
  isVerified: boolean;
  coverImage: string;
}

export interface ICompanyDocument extends ICompany, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
