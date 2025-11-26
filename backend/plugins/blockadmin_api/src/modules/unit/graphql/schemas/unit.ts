export const types = `
  type BlockAdminUnit {
    _id: String
    building: String
    buildingData: BlockAdminBuilding
    zoning: String
    number: String
    status: BlockAdminUnitStatus

    leads: [String]

    type: String
    createdAt: Date
    updatedAt: Date
  } 
`;

export const queries = `
  blockAdminGetUnit(_id: String!): BlockAdminUnit
  blockAdminGetUnits(zoning: String!): [BlockAdminUnit]
`;
