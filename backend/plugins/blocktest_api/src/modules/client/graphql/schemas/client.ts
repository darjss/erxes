import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type CVClientContact {
    name: String
    position: String
    phone_number: String
    email: String
  }

  enum CVClientType {
    individual
    state_owned
    joint_stock_company
    limited_liability_co
    foreign_llc
  }

  enum CVClientLeadSource {
    referral
    website
    cold_call
    network
    meeting
    tender
  }

  enum CVClientBusinessMainCategory {
    agriculture_farming
    mining_natural_resources
    manufacturing_industrial_production
    construction_engineering
    transportation_logistics
    wholesale_distribution
    retail_consumer_goods
    food_beverage_hospitality
    information_technology_it_software
    telecommunications
    financial_services_banking
    insurance_risk_management
    real_estate_property_management
    professional_services_consulting_legal_accounting
    healthcare_medical_services
    pharmaceuticals_biotechnology
    education_training
    media_advertising_marketing
    energy_utilities
    public_sector_government_services
    non_profit_ngos
    automotive_industry
    aviation_aerospace
    entertainment_sports_recreation
    textile_apparel_fashion
    chemicals_petrochemicals
    environmental_services_waste_recycling
    security_services
    agriculture_technology_agritech
    ecommerce_online_services
  }

  enum CVClientStatus {
    new
    negotiation
    won
    lost
  }

  type CVClient {
    _id: String
    name: String
    client_type: CVClientType
    lead_source: CVClientLeadSource
    registration_number: String
    operational_address: String
    business_type: CVClientBusinessMainCategory
    business_category: String
    status: CVClientStatus
    cvh_broker: String
    existing_insurance_policies: String
    claim_history_file: String
    description: String
    registered_date: Date
    isActive: Boolean
    bor_file: String
    service_agreement_file: String
    insurance_types: [String]
    contacts: [CVClientContact]
    createdAt: Date
    updatedAt: Date
  }

  input CVClientContactInput {
    name: String
    position: String
    phone_number: String
    email: String
  }

  input CVClientInput {
    name: String!
    client_type: CVClientType
    lead_source: CVClientLeadSource
    registration_number: String
    operational_address: String
    business_type: CVClientBusinessMainCategory
    business_category: String
    status: CVClientStatus
    cvh_broker: String
    existing_insurance_policies: String
    claim_history_file: String
    description: String
    registered_date: Date
    isActive: Boolean
    bor_file: String
    service_agreement_file: String
    insurance_types: [String]
    contacts: [CVClientContactInput]
  }

  input CVClientFilterInput {
    name: String
    client_type: CVClientType
    lead_source: CVClientLeadSource
    registration_number: String
    operational_address: String
    business_type: CVClientBusinessMainCategory
    business_category: String
    status: CVClientStatus
    cvh_broker: String
    existing_insurance_policies: String
    claim_history_file: String
    registered_date: Date
    isActive: Boolean
    ${GQL_CURSOR_PARAM_DEFS}
  }

  type CVClientListResponse {
    list: [CVClient]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

export const queries = `
  cvGetClient(_id: String!): CVClient
  cvGetClients(filter: CVClientFilterInput): CVClientListResponse
`;

export const mutations = `
  cvCreateClient(
    input: CVClientInput!
  ): CVClient

  cvUpdateClient(
    _id: String!,
    input: CVClientInput!
  ): CVClient

  cvRemoveClient(_id: String!): JSON
`;
