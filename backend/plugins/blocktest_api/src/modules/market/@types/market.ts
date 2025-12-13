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
  | 'sub_saharan_africa'
  | 'north_america'
  | 'south_america'
  | 'australia'
  | 'oceania'
  | 'other';

export type CVMarketContact = {
  name?: string;
  position?: string;
  phone_number?: string;
  email?: string;
};

export interface ICVMarket {
  name: string;
  description?: string;
  registration_number: string;
  operational_address: string;
  type: CVMarketType;
  specialization: CVMarketSpecialization;
  region: CVMarketRegion;
  country: string;
  onboarded: boolean;
  onboarded_date: Date;
  onboarding_status: 'pending' | 'approved' | 'rejected';
  business_partner_questionnaire_sent: boolean;
  business_partner_questionnaire_received: boolean;
  certificate_of_incorporation_sent: boolean;
  business_license_sent: boolean;
  business_license_received: boolean;
  audited_financial_reports_sent: boolean;
  audited_financial_reports_received: boolean;
  ownership_chart_sent: boolean;
  ownership_chart_received: boolean;
  compliance_policies_sent: boolean;
  compliance_policies_received: boolean;
  tob_sent: boolean;
  tob_received: boolean;
  contacts: CVMarketContact[];
  claim_handling_contact: CVMarketContact;
}

export interface ICVMarketDocument extends ICVMarket, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
