import { Document } from 'mongoose';

export interface ICVClientContact {
  name?: string;
  position?: string;
  phone_number?: string;
  email?: string;
}

export type ClientType =
  | 'individual'
  | 'state_owned'
  | 'joint_stock_company'
  | 'limited_liability_co'
  | 'foreign_llc';

export type LeadSource =
  | 'referral'
  | 'website'
  | 'cold_call'
  | 'network'
  | 'meeting'
  | 'tender';

export type BusinessMainCategory =
  | 'agriculture_farming'
  | 'mining_natural_resources'
  | 'manufacturing_industrial_production'
  | 'construction_engineering'
  | 'transportation_logistics'
  | 'wholesale_distribution'
  | 'retail_consumer_goods'
  | 'food_beverage_hospitality'
  | 'information_technology_it_software'
  | 'telecommunications'
  | 'financial_services_banking'
  | 'insurance_risk_management'
  | 'real_estate_property_management'
  | 'professional_services_consulting_legal_accounting'
  | 'healthcare_medical_services'
  | 'pharmaceuticals_biotechnology'
  | 'education_training'
  | 'media_advertising_marketing'
  | 'energy_utilities'
  | 'public_sector_government_services'
  | 'non_profit_ngos'
  | 'automotive_industry'
  | 'aviation_aerospace'
  | 'entertainment_sports_recreation'
  | 'textile_apparel_fashion'
  | 'chemicals_petrochemicals'
  | 'environmental_services_waste_recycling'
  | 'security_services'
  | 'agriculture_technology_agritech'
  | 'ecommerce_online_services';

export type ClientStatus = 'new' | 'negotiation' | 'won' | 'lost';

export interface ICVClient {
  name: string;
  client_type: ClientType;
  lead_source?: LeadSource;
  registration_number?: string;
  operational_address?: string;
  business_type?: BusinessMainCategory;
  business_category?: string;
  status: ClientStatus;
  cvh_broker?: string;
  existing_insurance_policies?: string;
  claim_history_file?: string;
  description?: string;
  registered_date?: Date;
  isActive: boolean;
  bor_file?: string;
  service_agreement_file?: string;
  insurance_types?: string[];
  contacts: ICVClientContact[];
}

export interface ICVClientFilter {
  name?: string;
  client_type?: ClientType;
  lead_source?: LeadSource;
  registration_number?: string;
  operational_address?: string;
  business_type?: BusinessMainCategory;
  business_category?: string;
  status?: ClientStatus;
  cvh_broker?: string;
  registered_date?: Date;
  isActive?: boolean;
}

// Mongoose document
export interface ICVClientDocument extends ICVClient, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
