export const types = `
  type BtkUnit {
    _id: String
    building: String
    buildingData: BtkBuilding
    zoning: String
    number: String
    type: BtkBuildingUnitUsageType
    tenureType: BtkBuildingUnitTenureType
    mainPrice: Int
    prices: [BtkProjectPrice]
    size: Int
    createdAt: Date
    updatedAt: Date
    status: BtkUnitStatus
  }

  input BtkUnitInput {
    building: String
    zoning: String
    number: String
    type: BtkBuildingUnitUsageType
    tenureType: BtkBuildingUnitTenureType
    mainPrice: Int
    prices: [BtkProjectPriceInput]
    useProjectPrice: Boolean
    size: Int
    status: BtkUnitStatus
  }
`;

export const queries = `
  btkGetUnit(_id: String!): BtkUnit
  btkGetUnits(zoning: String!): [BtkUnit]
`;

export const mutations = `
  btkCreateUnit(input: BtkUnitInput!): BtkUnit
  btkUpdateUnit(_id: String!, input: BtkUnitInput!): BtkUnit
  btkRemoveUnit(_id: String!): BtkUnit
`;
