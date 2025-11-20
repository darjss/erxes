import { IAddress } from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';
import { IBtk } from '~/types';

export interface IBtkCompanySocialLink {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
}
export interface IBtkCompany extends IBtk {
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
  socialLinks: IBtkCompanySocialLink;
  isVerified: boolean;
  coverImage: string;
}

export interface IBtkCompanyDocument extends IBtkCompany, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyQueryParams {
  searchValue?: string;
  isVerified?: string;
  location?: IAddress;
}
