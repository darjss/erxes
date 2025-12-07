import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
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
  }

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
  }

  type CVMarketContact {
    name: String
    position: String
    phone_number: String
    email: String
  }
  
  type CVMarketClaimHandlingContact {
    name: String
    position: String
    phone_number: String
    email: String
  }
  
  
  type CVMarket {
    _id: String
    name: String
    description: String
    registration_number: String
    operational_address: String
    type: CVMarketType
    specialization: CVMarketSpecialization
  }

  input CVMarketInput {
    name: String!
    description: String
    registration_number: String!
    operational_address: String!
    type: CVMarketType!
    specialization: CVMarketSpecialization!
    contacts: [CVMarketContactInput]
    claim_handling_contact: CVMarketClaimHandlingContactInput
  } 

  input CVMarketContactInput {
    name: String
    position: String
    phone_number: String
    email: String
  }

  input CVMarketClaimHandlingContactInput {
    name: String
    position: String
    phone_number: String
    email: String
  } 
`;

export const queries = `
  getCVMarket(_id: String!): CVMarket
  getCVMarkets: [CVMarket]
`;

export const mutations = `
  createCVMarket(name: String!): CVMarket
  updateCVMarket(_id: String!, name: String!): CVMarket
  removeCVMarket(_id: String!): CVMarket
`;
