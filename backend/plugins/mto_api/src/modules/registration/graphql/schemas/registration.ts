export const types = `
  type MtoRegistrationMembershipSummary {
    membershipTypeId: String!
    title: String!
    schemaVersion: String!
  }

  type MtoRegistrationApplication {
    _id: String
    createdAt: Date
    modifiedAt: Date
    subdomain: String
    membershipTypeId: String
    schemaVersion: String
    status: String
    answers: JSON
    instanceId: String
  }
`;

export const queries = `
  mtoRegistrationFormDefinition(membershipTypeId: String!, version: String): JSON
  mtoRegistrationMembershipSummaries: [MtoRegistrationMembershipSummary!]!
`;

export const mutations = `
  mtoRegistrationSubmit(
    membershipTypeId: String!
    schemaVersion: String!
    answers: JSON!
  ): MtoRegistrationApplication
`;
