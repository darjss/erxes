import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type MushopSubscription {
    _id: String!
    customerId: String!
    planId: String
    plan: MushopSubscriptionPlan
    status: String
    startDate: Date
    endDate: Date
    amount: Float
    currency: String
    invoiceId: String
    customer: JSON
    createdAt: Date
    updatedAt: Date
  }

  type MushopSubscriptionListResponse {
    list: [MushopSubscription]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

export const queries = `
  mushopMySubscription: MushopSubscription
  mushopIsSubscribed: Boolean
  mushopSubscriptions(searchValue: String, status: String, ${GQL_CURSOR_PARAM_DEFS}): MushopSubscriptionListResponse
  mushopSubscriptionDetail(_id: String!): MushopSubscription
`;

export const mutations = `
  mushopCancelMySubscription(_id: String!): MushopSubscription
  mushopCancelSubscription(_id: String!): MushopSubscription
  mushopGrantSubscription(customerId: String!, planId: String!, paymentId: String, amount: Float): MushopSubscription
`;
