export const types = `
  type CpBlockAdminUnit {
    _id: String
    building: String
    zoning: String
    number: String
    type: String
    size: Int
    leads: [String]
    mainPrice: Int
    prices: [String]
    status: String
    tenureType: String
  }
`;

const queryParams = `
  zoning: String
`;

export const queries = `
  cpBlockAdminGetUnits(${queryParams}): [CpBlockAdminUnit]
  cpBlockAdminGetUnit(_id: String): CpBlockAdminUnit
`;
