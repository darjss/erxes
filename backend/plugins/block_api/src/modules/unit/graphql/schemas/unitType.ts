export const types = `
  type UnitType {
    description: String
    size: Float
    type: String
    tenureType: String
    content: String
    price: Float
    prices: JSON
    status: String
    rooms: JSON
    roomsCount: Int
  }

  input UnitTypeInput {
    description: String
    size: Float
    type: String
    tenureType: String
    content: String
    price: Float
    prices: JSON
    status: String
    rooms: JSON
    roomsCount: Int
  }
`;

export const queries = `
  unitTypes: [UnitType]
`;

export const mutations = `
  createUnitType(input: UnitTypeInput!): UnitType
  updateUnitType(_id: ID!, input: UnitTypeInput!): UnitType
`;
