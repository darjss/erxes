export const types = `
  type CpBlockAdminUnit {
    _id: String
    building: String
    zoning: String
    number: String

    type: String
    status: BlockAdminUnitStatus
  }

  type CpBlockAdminUnitType {
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
    project: BlockAdminProject
    createdAt: Date
    updatedAt: Date
  }
`;

const queryParams = `
  zoning: String
`;

export const queries = `
  cpBlockAdminGetUnits(${queryParams}): [CpBlockAdminUnit]
  cpBlockAdminGetUnit(_id: String): CpBlockAdminUnit

  cpBlockAdminGetUnitTypes(project: String): [CpBlockAdminUnitType]
  cpBlockAdminGetUnitType(_id: String): CpBlockAdminUnitType
`;
