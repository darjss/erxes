export const types = `
  type MushopCustomerSubscription {
    _id: String!
    cpUserId: String!
    erxesCustomerId: String
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
  mushopSubscriptions(searchValue: String, status: String, limit: Int, cursor: String, direction: CURSOR_DIRECTION): MushopCustomerSubscriptionListResponse
  mushopSubscriptionDetail(_id: String!): MushopCustomerSubscription
`;

export const mutations = `
  mushopCancelMySubscription(_id: String!): MushopCustomerSubscription
  mushopCancelSubscription(_id: String!): MushopCustomerSubscription
`;
