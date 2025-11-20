export const types = `
  enum BlockBuildingStatus {
    planned
    on_going
    on_sale
    completed
  }  

  type BlockBuilding {
    _id: String
    name: String
    type: String
    description: String 
    project: String 
    coverImage: String

    status: BlockBuildingStatus
    startDate: Date
    endDate: Date
  }

  input BlockBuildingInput {
    name: String
    type: String
    description: String
    project: String
    coverImage: String

    status: BlockBuildingStatus
    startDate: Date
    endDate: Date
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
