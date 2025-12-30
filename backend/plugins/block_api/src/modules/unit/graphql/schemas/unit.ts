export const types = `
  type BlockUnit {
    _id: String
    building: String
    buildingData: BlockBuilding
    zoning: String
    number: String
    status: String
    
    leads: [String]

    type: String
    unitType: UnitType
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
`;

export const mutations = `
  blockCreateUnit(input: BlockUnitInput!): BlockUnit
  blockCreateUnits(input: BlockUnitsInput!): [BlockUnit]
  blockUpdateUnit(_id: String!, input: BlockUnitInput!): BlockUnit
  blockRemoveUnit(_id: String!): BlockUnit
  blockRemoveUnits(_ids: [String]): JSON
`;
