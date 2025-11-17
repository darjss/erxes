export const types = `
  type BtkUnitLead {
    leadType: String!
    leadId: String!
    unit: ID!
  }

  input BtkUnitLeadInput {
    leadType: String!
    leadId: String!
    unit: ID!
  }

`;

export const queries = `
  btkGetUnitLeads(unit: ID!): [BtkUnitLead]
`;

export const mutations = `
  btkAddUnitLead(input: BtkUnitLeadInput!): BtkUnitLead
  btkRemoveUnitLead(input: BtkUnitLeadInput!): BtkUnitLead
`;
