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
    status: String
  } 
`;

export const queries = `
  blockGetUnit(_id: String!): BlockUnit
  blockGetUnits(zoning: String!): [BlockUnit]
`;
