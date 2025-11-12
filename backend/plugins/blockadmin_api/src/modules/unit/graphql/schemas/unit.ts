export const types = `
  type BlockAdminUnit {
    _id: String
    building: String
    buildingData: BlockAdminBuilding
    zoning: String
    number: String
    type: BlockAdminBuildingUnitUsageType
    tenureType: BlockAdminBuildingUnitTenureType
    mainPrice: Int
    prices: [BlockAdminProjectPrice]
    size: Int
    createdAt: Date
    updatedAt: Date
    status: BlockAdminUnitStatus
  } 
`;

export const queries = `
  blockAdminGetUnit(_id: String!): BlockAdminUnit
  blockAdminGetUnits(zoning: String!): [BlockAdminUnit]
`;
