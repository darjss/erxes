export const types = `
  type CpBlockAdminUnit {
    _id: String
    building: String
    zoning: String
    number: String
    type: String
    size: Number
    leads: [String]
    mainPrice: Number
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
