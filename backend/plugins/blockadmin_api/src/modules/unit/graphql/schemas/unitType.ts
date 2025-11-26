export const types = `
  type BlockAdminUnitType {
    _id: String
    name: String
    description: String
    size: Float
    type: BlockAdminBuildingUnitUsageType
    subType: String
    featureTypes: [String]
    tenureType: BlockAdminBuildingUnitTenureType
    content: String
    price: Float
    prices: [BlockAdminProjectPrice]
    status: String
    rooms: JSON
    roomsCount: Int
    coverImage: String
    images: [String]
    planImages: [String]
    project: BlockAdminProject
    createdAt: Date
    updatedAt: Date
  }
`;

export const queries = `
  blockAdminGetUnitTypes(project: String): [BlockAdminUnitType]
  blockAdminGetUnitType(_id: String!): BlockAdminUnitType
`;
