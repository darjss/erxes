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
    project: BlockProject
    images: [String]
    planImages: [String]
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
    
    project: String

    images: [String]
    planImages: [String]
  }
`;

export const queries = `
  blockGetUnitTypes(project: String): [UnitType]
  blockGetUnitType(_id: String!): UnitType
`;

export const mutations = `
  blockCreateUnitType(input: UnitTypeInput!): UnitType
  blockUpdateUnitType(_id: String!, input: UnitTypeInput!): UnitType
`;
