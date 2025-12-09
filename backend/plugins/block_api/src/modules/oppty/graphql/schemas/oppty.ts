import { OPPTY_CUSTOMER_SOURCES, OPPTY_STATUSES } from '../../constants';
import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `

  enum OpptyStatus {
    ${Object.values(OPPTY_STATUSES).join(' | ')}
  }

  enum OpptyCustomerSource {
    ${Object.values(OPPTY_CUSTOMER_SOURCES).join(' | ')}
  }

  type Oppty {
    _id: String
    number: String
    description: String
    customerId: String
    unitTypes: [String]
    units: [String]
    assignedUserId: String
    status: OpptyStatus
    labelIds: [String]
    tagIds: [String]
    projectId: String
    startDate: Date
    targetDate: Date
    customerSource: OpptyCustomerSource
  }

  input OpptyInput {
    number: String
    description: String
    customerId: String
    unitTypes: [String]
    units: [String]
    assignedUserId: String
    status: OpptyStatus
    labelIds: [String]
    tagIds: [String]
    projectId: String
    startDate: Date
    targetDate: Date
    customerSource: OpptyCustomerSource
  }

  input OpptyFilter {
    number: String
    description: String
    customerId: String
    unitType: String
    unit: String
    assignedUserId: String
    status: OpptyStatus
    startDate: Date
    targetDate: Date
    customerSource: OpptyCustomerSource
    labelId: String
    tagId: String
    ${GQL_CURSOR_PARAM_DEFS}
  }

  type OpptyListResponse {
    list: [Oppty]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

export const queries = `
  getOpptys(projectId: String!, filter: OpptyFilter): OpptyListResponse
`;

export const mutations = `
  createOppty(input: OpptyInput!): Oppty
  updateOppty(_id: String!, input: OpptyInput!): Oppty
  deleteOppty(_id: String!): Oppty
  convertToContract(_id: String!, unit: String!, paymentPlan: BlockProjectPaymentPlanInput!): String
`;
