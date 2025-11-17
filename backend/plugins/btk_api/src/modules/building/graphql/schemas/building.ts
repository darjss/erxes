export const types = `
  type BtkBuilding {
    _id: String
    name: String
    type: String
    description: String
    project: String
    coverImage: String

    startDate: Date
    endDate: Date
  }

  input BtkBuildingInput {
    name: String
    type: String
    description: String
    project: String
    coverImage: String

    startDate: Date
    endDate: Date
  }
`;

export const queries = `
  btkGetBuildings(project: String!): [BtkBuilding]
  btkGetBuilding(_id: String!): BtkBuilding
`;

export const mutations = `
  btkCreateBuilding(input: BtkBuildingInput!): BtkBuilding
  btkDupplicateBuilding(buildingId: String!): BtkBuilding
  btkUpdateBuilding(_id: String!, input: BtkBuildingInput!): BtkBuilding
  btkDeleteBuilding(_id: String!): BtkBuilding
`;
