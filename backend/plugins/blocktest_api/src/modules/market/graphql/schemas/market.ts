import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  enum CVMarketType {
    insurance
    reinsurance
    mga
    sub_broker
    loss_adjuster
    risk_engineer
  }

  enum CVMarketSpecialization {
    life_insurance
    general_insurance
    reinsurance
    service
    other
  }

  enum CVMarketRegion {
    northeast_asia
    southeast_asia
    central_asia
    western_europe
    eastern_europe
    northern_europe
    middle_east
    sub-saharan_africa
    north_america
    south_america
    australia
    oceania
    other
  }

  type CVMarketContact {
    name: String
    position: String
    phone_number: String
    email: String
  }

  input CVMarketContactInput {
    name: String
    position: String
    phone_number: String
    email: String
  }
  
  
  enum CVMarketOnboardingStatus {
    pending
    approved
    rejected
  }

  type CVMarket {
    _id: String
    name: String
    description: String
    registration_number: String
    operational_address: String
    type: CVMarketType
    specialization: CVMarketSpecialization
    region: CVMarketRegion
    country: String
    onboarded: Boolean
    onboarded_date: Date
    onboarding_status: CVMarketOnboardingStatus
    business_partner_questionnaire_sent: Boolean
    business_partner_questionnaire_received: Boolean
    certificate_of_incorporation_sent: Boolean
    certificate_of_incorporation_received: Boolean
    business_license_sent: Boolean
    business_license_received: Boolean
    audited_financial_reports_sent: Boolean
    audited_financial_reports_received: Boolean
    ownership_chart_sent: Boolean
    ownership_chart_received: Boolean
    compliance_policies_sent: Boolean
    compliance_policies_received: Boolean
    tob_sent: Boolean
    tob_received: Boolean
    contacts: [CVMarketContact]
    claim_handling_contact: CVMarketContact
    createdAt: Date
    updatedAt: Date
  }

  input CVMarketInput {
    name: String
    description: String
    registration_number: String
    operational_address: String
    type: CVMarketType
    specialization: CVMarketSpecialization
    region: CVMarketRegion
    country: String
    onboarded: Boolean
    onboarded_date: Date
    onboarding_status: CVMarketOnboardingStatus
    business_partner_questionnaire_sent: Boolean
    business_partner_questionnaire_received: Boolean
    certificate_of_incorporation_sent: Boolean
    certificate_of_incorporation_received: Boolean
    business_license_sent: Boolean
    business_license_received: Boolean
    audited_financial_reports_sent: Boolean
    audited_financial_reports_received: Boolean
    ownership_chart_sent: Boolean
    ownership_chart_received: Boolean
    compliance_policies_sent: Boolean
    compliance_policies_received: Boolean
    tob_sent: Boolean
    tob_received: Boolean
    contacts: [CVMarketContactInput]
    claim_handling_contact: CVMarketContactInput
  }

  input CVMarketFilterInput {
    name: String
    description: String
    registration_number: String
    operational_address: String
    type: CVMarketType
    specialization: CVMarketSpecialization
    region: CVMarketRegion
    country: String
    onboarded: Boolean
    onboarding_status: CVMarketOnboardingStatus
    business_partner_questionnaire_sent: Boolean
    business_partner_questionnaire_received: Boolean
    certificate_of_incorporation_sent: Boolean
    certificate_of_incorporation_received: Boolean
    business_license_sent: Boolean
    business_license_received: Boolean
    audited_financial_reports_sent: Boolean
    audited_financial_reports_received: Boolean
    ownership_chart_sent: Boolean
    ownership_chart_received: Boolean
    compliance_policies_sent: Boolean
    compliance_policies_received: Boolean
    tob_sent: Boolean
    tob_received: Boolean
    ${GQL_CURSOR_PARAM_DEFS}
  }

  type CVMarketListResponse {
    list: [CVMarket]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

export const queries = `
  getCVMarket(_id: String!): CVMarket
  getCVMarkets(filter: CVMarketFilterInput, ${GQL_CURSOR_PARAM_DEFS}): CVMarketListResponse
`;

export const mutations = `
  createCVMarket(input: CVMarketInput!): CVMarket
  updateCVMarket(_id: String!, input: CVMarketInput!): CVMarket
  removeCVMarket(_id: String!): JSON
`;
