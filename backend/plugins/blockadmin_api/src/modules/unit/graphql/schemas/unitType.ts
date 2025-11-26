export const types = `
  type BlockAdminUnitType {
    _id: String
    name: String
    description: String
    size: Float
    type: BlockAdminBuildingUnitUsageType
    tenureType: BlockAdminBuildingUnitTenureType
    content: String
    price: Float
    prices: [BlockAdminProjectPrice]
    status: String
    rooms: JSON
    roomsCount: Int
    project: BlockProject
    createdAt: Date
    updatedAt: Date
  }
`;

export const queries = `
  blockAdminGetUnitTypes(project: String): [BlockAdminUnitType]
  blockAdminGetUnitType(_id: String!): BlockAdminUnitType
`;