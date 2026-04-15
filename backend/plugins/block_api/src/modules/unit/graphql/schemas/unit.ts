export const types = `
  type BlockAgencyBasic {
    _id: String!
    name: String
    brandName: String
  }

  type BlockUnit {
    _id: String
    building: String
    buildingData: BlockBuilding
    zoning: String
    zoningData: BlockBuildingZoning
    number: String
    status: String

    projectData: BlockProject

    leads: [String]

    type: String
    unitType: UnitType
    blockSubdomain: String
    blockEntityId: String
    agencySubdomain: String
    agencyEntityId: String
    createdAt: Date
    updatedAt: Date
  }

  input BlockUnitInput {
    building: String
    zoning: String
    zonings: [String]
    number: String
    type: String
    useProjectPrice: Boolean
    status: String
    agencyEntityId: String
  }

  input BlockTransferUnitInput {
    unitId: String!
    agencySubdomain: String!
    agencyId: String!
  }

  input BlockUnitsInput {
    buildingId: String
    units: [String]
    zoneRange: [Int]
  }
`;

export const queries = `
  blockGetUnit(_id: String!): BlockUnit
  blockGetUnits(zoning: String, zonings: [String]): [BlockUnit]
  blockGetAgencies: [BlockAgencyBasic]
`;

export const mutations = `
  blockCreateUnit(input: BlockUnitInput!): BlockUnit
  blockCreateUnits(input: BlockUnitsInput!): [BlockUnit]
  blockUpdateUnit(_id: String!, input: BlockUnitInput!): BlockUnit
  blockRemoveUnit(_id: String!): BlockUnit
  blockRemoveUnits(_ids: [String]): JSON
  blockTransferUnit(input: BlockTransferUnitInput!): BlockUnit
`;
