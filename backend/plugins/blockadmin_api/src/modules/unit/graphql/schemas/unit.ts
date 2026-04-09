export const types = `
  type BlockAdminUnit {
    _id: String
    building: String
    buildingData: BlockAdminBuilding
    zoning: String
    number: String
    status: BlockAdminUnitStatus
    isFeatured: Boolean
    leads: [String]

    type: String
    agencySubdomain: String
    agencyEntityId: String
    createdAt: Date
    updatedAt: Date
  }

  input BlockAdminUnitInput {
    isFeatured: Boolean
  }
`;

export const queries = `
  blockAdminGetUnit(_id: String!): BlockAdminUnit
  blockAdminGetUnits(zoning: String!): [BlockAdminUnit]
`;

export const mutations = `
  blockAdminUpdateUnit(_id: String!, input: BlockAdminUnitInput): BlockAdminUnit
`;
