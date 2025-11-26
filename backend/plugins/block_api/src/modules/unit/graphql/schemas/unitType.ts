export const types = `
  type UnitType {
    _id: String
    name: String
    description: String
    size: Float
    type: BlockBuildingUnitUsageType
    tenureType: BlockBuildingUnitTenureType
    content: String
    price: Float
    prices: [BlockProjectPrice]
    status: String
    rooms: JSON
    roomsCount: Int

    createdAt: Date
    updatedAt: Date
  }

  input UnitTypeInput {
    name: String
    description: String
    size: Float
    type: BlockBuildingUnitUsageType
    tenureType: BlockBuildingUnitTenureType
    content: String
    price: Float
    prices: [BlockProjectPriceInput]
    status: String
    rooms: JSON
    roomsCount: Int
  }
`;

export const queries = `
  blockGetUnitTypes: [UnitType]
  blockGetUnitType(_id: String!): UnitType
`;

export const mutations = `
  blockCreateUnitType(input: UnitTypeInput!): UnitType
  blockUpdateUnitType(_id: String!, input: UnitTypeInput!): UnitType
`;
