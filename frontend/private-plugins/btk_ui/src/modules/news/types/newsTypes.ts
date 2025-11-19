export interface INews {
  _id: string;
  content: string;
  title: string;
  name: string;
  coverImage?: string;
  location?: INewsLocation;
}

export interface INewsLocation {
  address?: string;
  city?: string;
  district?: string;
  lat?: number;
  lng?: number;
  parcelId?: string;
}

export interface INewsPrice {
  currency: string;
  price: number;
  priceType: 'priceBySize' | 'priceByUnit';
}

export interface INewsDetail extends INews {
  isPublished: boolean;
  status: 'verified' | 'unverified' | 'pending';
  description: string;
  logo: string;
  images: string[];
  title: string;
  content: string;
  type: string[];
  mainPrice: number;
  prices: INewsPrice[];
  bankPartners: string[];
  newsAmenities: { category: string; amenities: string[] }[];
}

export interface INewsGeneralInput {
  name: string | null;
  location: INewsLocation | null;
  title: string | null;
  content: string | null;
  description: string | null;
  status: string | null;
  coverImage: string | null;
  mainPrice: number | null;
  prices: INewsPrice[] | null;
  bankPartners: string[] | null;
  newsAmenities: { category: string; amenities: string[] }[];
}

export interface INewsMember {
  _id: string;
  memberId: string;
  news: string;
  role: string;
}
