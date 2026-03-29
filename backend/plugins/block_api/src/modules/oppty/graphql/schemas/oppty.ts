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

  enum Priority {
    low
    medium
    high
  }

  type PropertyRow {
    buildingId: String
    zoningId: String
    unitId: String
    isMain: Boolean
  }

  input PropertyRowInput {
    buildingId: String
    zoningId: String
    unitId: String
    isMain: Boolean
  }

  type Oppty {
    _id: String
    number: String
    description: String
    customerId: String
    unitType: String
    tenureType: String
    unit: String
    units: [String]
    propertyRows: [PropertyRow]
    assignedUserId: String
    status: String
    labelIds: [String]
    tagIds: [String]
    projectId: String
    priority: Priority
    startDate: Date
    targetDate: Date
    customerSource: String
    propertiesData: JSON
    createdAt: Date
    updatedAt: Date
  }

  input IOpptyInput {
    number: String
    description: String
    customerId: String
    unitType: String
    tenureType: String
    units: [String]
    unit: String
    propertyRows: [PropertyRowInput]
    assignedUserId: String
    status: String
    labelIds: [String]
    tagIds: [String]
    startDate: Date
    targetDate: Date
    customerSource: String
    projectId: String
    priority: Priority
    propertiesData: JSON
    # timer nemn
    # chosenUnit
    # activity
  }

  input IOpptyFilter {
    searchValue: String
    number: String
    description: String
    customerId: String
    unitType: String
    tenureType: String
    unit: String
    assignedUserId: String
    status: String
    priority: String
    startDate: Date
    targetDate: Date
    dateFilters: String
    customerSource: String
    labelId: String
    tagId: String
    ${GQL_CURSOR_PARAM_DEFS}
  }

  type OpptyUnitRow {
    unitId: String
    buildingId: String
    zoningId: String
  }

  type OpptyListResponse {
    list: [Oppty]
    pageInfo: PageInfo
    totalCount: Int
  }

  type OpptySubscription {
    type: String
    oppty: Oppty
  }

  type OpptyActivitySubscription {
    type: String
    activity: JSON
  }
`;

export const queries = `
  blockGetOppty(_id: String!): Oppty
  blockGetOpptys(projectId: String!, filter: IOpptyFilter): OpptyListResponse
  blockGetOpptyUnitRows(_id: String!): [OpptyUnitRow]
`;

export const mutations = `
  blockCreateOppty(input: IOpptyInput!): Oppty
  blockUpdateOppty(_id: String!, input: IOpptyInput!): Oppty
  blockDeleteOppty(_id: String!): Oppty
  blockOpptyConvertToContract(_id: String!, unit: String!, paymentPlan: BlockProjectPaymentPlanInput!): String
`;
