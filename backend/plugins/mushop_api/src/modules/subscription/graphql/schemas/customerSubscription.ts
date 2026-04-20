import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type MushopCustomerSubscription {
    _id: String!
    subscriberId: String!
    status: String
    startDate: Date
    endDate: Date
    amount: Float
    currency: String
    invoiceId: String
    createdAt: Date
    updatedAt: Date
  }

  type MushopCustomerSubscriptionListResponse {
    list: [MushopCustomerSubscription]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

export const queries = `
  mushopMySubscription: MushopCustomerSubscription
  mushopIsSubscribed: Boolean
  mushopSubscriptions(searchValue: String, status: String, ${GQL_CURSOR_PARAM_DEFS}): MushopCustomerSubscriptionListResponse
  mushopSubscriptionDetail(_id: String!): MushopCustomerSubscription
`;

export const mutations = `
  mushopCancelMySubscription(_id: String!): MushopCustomerSubscription
  mushopCancelSubscription(_id: String!): MushopCustomerSubscription
`;
