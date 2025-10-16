export interface IProject {
  _id: string;
  name: string;
  coverImage?: string;
  location?: IProjectLocation;
}

export interface IProjectLocation {
  address?: string;
  city?: string;
  district?: string;
  lat?: number;
  lng?: number;
  parcelId?: string;
}

export interface IProjectPrice {
  currency: string;
  price: number;
  priceType: 'priceBySize' | 'priceByUnit';
}

export interface IProjectDetail extends IProject {
  isPublished: boolean;
  status: 'verified' | 'unverified' | 'pending';
  description: string;
  logo: string;
  images: string[];
  type: string[];
  mainPrice: number;
  prices: IProjectPrice[];
  bankPartners: string[];
}

export interface IProjectGeneralInput {
  name: string | null;
  location: IProjectLocation | null;
  status: string | null;
  coverImage: string | null;
  mainPrice: number | null;
  prices: IProjectPrice[] | null;
  bankPartners: string[] | null;
}

export interface IProjectMember {
  _id: string;
  memberId: string;
  project: string;
  role: string;
}
