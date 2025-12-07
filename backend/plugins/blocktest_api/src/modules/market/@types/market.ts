import { Document } from 'mongoose';

export type CVMarketType =
  | 'insurance'
  | 'reinsurance'
  | 'mga'
  | 'sub_broker'
  | 'loss_adjuster'
  | 'risk_engineer';

export type CVMarketSpecialization =
  | 'life_insurance'
  | 'general_insurance'
  | 'reinsurance'
  | 'service'
  | 'other';

export type CVMarketRegion =
  | 'northeast_asia'
  | 'southeast_asia'
  | 'central_asia'
  | 'western_europe'
  | 'eastern_europe'
  | 'northern_europe'
  | 'middle_east'
  | 'sub-saharan_africa'
  | 'north_america'
  | 'south_america'
  | 'australia'
  | 'oceania'
  | 'other';

export interface ICVMarket {
  name?: string;
  description?: string;
  registration_number?: string;
  operational_address?: string;
  type: CVMarketType;
  specialization: CVMarketSpecialization;
  region: CVMarketRegion;
  country: string;
  onboarded: boolean;
  onboarded_date: Date;
  onboarding_status: 'pending' | 'approved' | 'rejected';
}

export interface ICVMarketDocument extends ICVMarket, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
