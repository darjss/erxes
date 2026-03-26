import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

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
    membershipTypeTitle: String
    schemaVersion: String
    status: String
    answers: JSON
    instanceId: String
  }

  type MtoRegistrationApplicationListResponse {
    list: [MtoRegistrationApplication]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const registrationListParams = `
  membershipTypeId: String,
  status: String,
`;

export const queries = `
  mtoRegistrationFormDefinition(membershipTypeId: String!, version: String): JSON
  mtoRegistrationMembershipSummaries: [MtoRegistrationMembershipSummary!]!
  mtoRegistrationApplications(${registrationListParams} ${GQL_CURSOR_PARAM_DEFS}): MtoRegistrationApplicationListResponse
  mtoRegistrationApplicationsCount(${registrationListParams}): Int
  mtoRegistrationApplication(_id: String!): MtoRegistrationApplication
`;

export const mutations = `
  mtoRegistrationSubmit(
    membershipTypeId: String!
    schemaVersion: String!
    answers: JSON!
  ): MtoRegistrationApplication
  mtoRegistrationApplicationUpdate(
    _id: String!
    answers: JSON
    status: String
  ): MtoRegistrationApplication
`;
