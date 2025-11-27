export const types = `
  type CpBlockAdminUnit {
    _id: String
    building: String
    zoning: String
    number: String
    isFeatured: Boolean

    type: String
    status: BlockAdminUnitStatus
  }

  type CpBlockAdminUnitType {
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

const queryParams = `
  project: String
  floor: Int
  isFeatured: Boolean
`;

export const queries = `
  cpBlockAdminGetUnits(${queryParams}): [CpBlockAdminUnit]
  cpBlockAdminGetUnit(_id: String): CpBlockAdminUnit

  cpBlockAdminGetUnitTypes(project: String): [CpBlockAdminUnitType]
  cpBlockAdminGetUnitType(_id: String): CpBlockAdminUnitType
`;