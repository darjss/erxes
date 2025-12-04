export const types = `
  type BlockUnit {
    _id: String
    building: String
    buildingData: BlockBuilding
    zoning: String
    number: String
    status: BlockUnitStatus
    
    leads: [String]

    type: String
    unitType: UnitType
    createdAt: Date
    updatedAt: Date
  } 

  input BlockUnitInput {
    building: String
    zoning: String
    number: String
    type: String
    useProjectPrice: Boolean
    status: BlockUnitStatus
  }
`;

export const queries = `
  blockGetUnit(_id: String!): BlockUnit
  blockGetUnits(zoning: String!): [BlockUnit]
`;

export const mutations = `
  blockCreateUnit(input: BlockUnitInput!): BlockUnit
  blockUpdateUnit(_id: String!, input: BlockUnitInput!): BlockUnit
  blockRemoveUnit(_id: String!): BlockUnit
`;
