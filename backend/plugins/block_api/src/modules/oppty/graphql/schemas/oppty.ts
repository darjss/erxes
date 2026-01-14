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
    createdAt: Date
    updatedAt: Date
  }

  input IOpptyInput {
    number: String
    description: String
    customerId: String
    unitTypes: [String]
    units: [String]
    assignedUserId: String
    status: OpptyStatus
    labelIds: [String]
    tagIds: [String]
    startDate: Date
    targetDate: Date
    customerSource: String
    projectId: String

    # timer nemn
    # chosenUnit
    # activity
  }

  input IOpptyFilter {
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
  blockGetOpptys(projectId: String!, filter: IOpptyFilter): OpptyListResponse
`;

export const mutations = `
  blockCreateOppty(input: IOpptyInput!): Oppty
  blockUpdateOppty(_id: String!, input: IOpptyInput!): Oppty
  blockDeleteOppty(_id: String!): Oppty
  blockOpptyConvertToContract(_id: String!, unit: String!, paymentPlan: BlockProjectPaymentPlanInput!): String
`;
