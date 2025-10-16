export const types = `
  type BlockBuilding {
    _id: String
    name: String
    type: String
    description: String 
    project: String 
    coverImage: String
  }

  input BlockBuildingInput {
    name: String
    type: String
    description: String
    project: String
    coverImage: String
  }
`;

export const queries = `
  blockGetBuildings(project: String!): [BlockBuilding]
  blockGetBuilding(_id: String!): BlockBuilding
`;

export const mutations = `
  blockCreateBuilding(input: BlockBuildingInput!): BlockBuilding
  blockDupplicateBuilding(buildingId: String!): BlockBuilding
  blockUpdateBuilding(_id: String!, input: BlockBuildingInput!): BlockBuilding
  blockDeleteBuilding(_id: String!): BlockBuilding
`;
