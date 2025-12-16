export const types = `

  enum BlockAdminBuildingStatus {
    planned
    on_going
    on_sale
    completed
  }

  type BlockAdminBuilding {
    _id: String
    name: String
    types: [String]
    description: String 
    project: String 
    coverImage: String

    status: BlockAdminBuildingStatus
    startDate: Date
    endDate: Date
  }
`;

export const queries = `
  blockAdminGetBuildings(project: String!): [BlockAdminBuilding]
  blockAdminGetBuilding(_id: String!): BlockAdminBuilding
`;
