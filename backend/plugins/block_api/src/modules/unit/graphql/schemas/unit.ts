export const types = `
  type BlockUnit {
    _id: String
    building: String
    buildingData: BlockBuilding
    zoning: String
    number: String
    type: BlockBuildingUnitUsageType
    tenureType: BlockBuildingUnitTenureType
    mainPrice: Int
    prices: [BlockProjectPrice]
    size: Int
    createdAt: Date
    updatedAt: Date
    status: BlockUnitStatus
  } 

  input BlockUnitInput {
    building: String
    zoning: String
    number: String
    type: BlockBuildingUnitUsageType
    tenureType: BlockBuildingUnitTenureType
    mainPrice: Int
    prices: [BlockProjectPriceInput]
    useProjectPrice: Boolean
    size: Int
    status: BlockUnitStatus
  }
`;

export const queries = `
  blockGetUnit(_id: String!): BlockUnit
  blockGetUnits(zoning: String!): [BlockUnit]
`;

export const mutations = `
  blockCreateUnit(input: BlockUnitInput!): BlockUnit
  blockUpdateUnit(_id: String!, input: BlockUnitInput!): BlockUnit
  blockRemoveUnit(_id: String!): BlockUnit
`;
