export const types = `
  type CpBlockAdminBuilding {
    _id: String
    name: String
    description: String
    type: String
    project: String
    usageType: String
    coverImage: String
    status: String
    startDate: Date
    endDate: Date
  }
`;

const queryParams = `
  project: String
`;

export const queries = `
  cpBlockAdminGetBuildings(${queryParams}): [CpBlockAdminBuilding]
  cpBlockAdminGetBuilding(_id: String): CpBlockAdminBuilding
`;
