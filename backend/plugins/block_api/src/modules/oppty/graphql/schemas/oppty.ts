import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  enum OpptyStatus {
    new_lead_unassigned
    assigned_in_contact
    qualified_lead
    unit_shortlist_created
    property_viewing
    unit_selected
    negotiation
    reservation
    contract_drafting_signing
    closed_successful
    closed_unsuccessful
    cancelled
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
    customerSource: String
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
    customerSource: String
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
    customerSource: String
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
