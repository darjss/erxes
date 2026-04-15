export const types = `
  type BlockAgencyUnitAgency {
    name: String
  }

  type BlockAgencyUnit {
    _id: String!
    blockUnitId: String!
    agencyId: String!
    blockSubdomain: String!
    agencySubdomain: String!
    blockDeveloperName: String
    unitNumber: String
    projectId: String
    memberId: String
    assignedAt: Date
    createdAt: Date
    updatedAt: Date
    agency: BlockAgencyUnitAgency
  }
`;

export const queries = `
  blockAgencyGetUnits(agencyId: String, projectId: String, memberId: String, page: Int, perPage: Int): [BlockAgencyUnit]
  blockAgencyGetUnitsTotalCount(agencyId: String, projectId: String, memberId: String): Int
`;

export const mutations = `
  blockAgencyAssignUnitToMember(_id: String!, memberId: String): BlockAgencyUnit
  blockAgencyRemoveUnit(_id: String!): Boolean
`;
