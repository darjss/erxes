import { IPageInfo } from 'ui-modules';

export interface ISupplier {
  _id: string;
  name?: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  registrationNumber?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  website?: string;
  dateFounded?: string;
  verificationStatus?: string;
  tierLevel?: string;
  address?: {
    short?: string;
    details?: { city?: string; city_district?: string };
  };
  createdAt?: string;
  socialLinks?: Record<string, string>;
}

export interface ISupplierList {
  list: ISupplier[];
  pageInfo: IPageInfo;
  totalCount?: number;
}
