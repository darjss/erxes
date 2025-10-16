export const types = `
  type BlockUnitLead {
    leadType: String!
    leadId: String!
    unit: ID!
  }

  input BlockUnitLeadInput {
    leadType: String!
    leadId: String!
    unit: ID!
  }
    
`;

export const queries = `
  blockGetUnitLeads(unit: ID!): [BlockUnitLead]
`;

export const mutations = `  
  blockAddUnitLead(input: BlockUnitLeadInput!): BlockUnitLead
  blockRemoveUnitLead(input: BlockUnitLeadInput!): BlockUnitLead
`;
