export const types = `
  type UnitType {
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
  unitTypes: [UnitType]
`;

export const mutations = `
  createUnitType(input: UnitTypeInput!): UnitType
  updateUnitType(_id: ID!, input: UnitTypeInput!): UnitType
`;
