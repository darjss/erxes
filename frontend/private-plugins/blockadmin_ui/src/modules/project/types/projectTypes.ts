export interface IProject {
  _id: string;
  name: string;
  coverImage?: string;
  location?: IProjectLocation;
  developer: string;
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
  projectAmenities: { category: string; amenities: string[] }[];
  developerId: string;
}

export interface IProjectGeneralInput {
  name: string | null;
  location: IProjectLocation | null;
  status: string | null;
  coverImage: string | null;
  mainPrice: number | null;
  prices: IProjectPrice[] | null;
  bankPartners: string[] | null;
  projectAmenities: { category: string; amenities: string[] }[];
}

export interface IProjectMember {
  _id: string;
  memberId: string;
  project: string;
  role: string;
}
