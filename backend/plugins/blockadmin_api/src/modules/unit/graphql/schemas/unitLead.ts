export const types = `
  type BlockAdminUnitLead {
    leadType: String!
    leadId: String!
    unit: ID!
  }
`;

export const queries = `
  blockAdminGetUnitLeads(unit: ID!): [BlockAdminUnitLead]
`;
