import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type MushopSubscriptionPlan {
    _id: String!
    name: String!
    description: String
    price: Float!
    currency: String
    durationMonths: Int
    isActive: Boolean
    createdAt: Date
    updatedAt: Date
  }

  type MushopSubscriptionPlanListResponse {
    list: [MushopSubscriptionPlan]
    pageInfo: PageInfo
    totalCount: Int
  }

  input MushopSubscriptionPlanInput {
    name: String!
    description: String
    price: Float!
    currency: String
    durationMonths: Int
  }
`;

export const queries = `
  mushopSubscriptionPlans(searchValue: String, isActive: Boolean, ${GQL_CURSOR_PARAM_DEFS}): MushopSubscriptionPlanListResponse
  mushopSubscriptionPlanDetail(_id: String!): MushopSubscriptionPlan
`;

export const mutations = `
  mushopSubscriptionPlanCreate(doc: MushopSubscriptionPlanInput!): MushopSubscriptionPlan
  mushopSubscriptionPlanUpdate(_id: String!, doc: MushopSubscriptionPlanInput!): MushopSubscriptionPlan
  mushopSubscriptionPlanDeactivate(_id: String!): MushopSubscriptionPlan
`;
