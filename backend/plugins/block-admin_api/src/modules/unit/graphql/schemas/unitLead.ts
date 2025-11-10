export const types = `
  type BlockUnitLead {
    leadType: String!
    leadId: String!
    unit: ID!
  }
`;

export const queries = `
  blockGetUnitLeads(unit: ID!): [BlockUnitLead]
`;
