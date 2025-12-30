export const types = `
  type OneFitMembershipPlan {
    _id: String
    createdAt: Date
    modifiedAt: Date
    name: String
    description: String
    creditAmount: Float
    duration: Int
    price: Float
    isActive: Boolean
  }

  type OneFitMembershipPlanListResponse {
    list: [OneFitMembershipPlan]
    pageInfo: PageInfo
    totalCount: Int
  }

  type OneFitMembershipPurchase {
    _id: String
    createdAt: Date
    modifiedAt: Date
    userId: String
    planId: String
    status: String
    purchasedAt: Date
    paidAt: Date
    activatedAt: Date
    expiresAt: Date
    amount: Float
    invoiceId: String
    plan: OneFitMembershipPlan
    invoice: Invoice
  }

  type OneFitMembershipPurchaseListResponse {
    list: [OneFitMembershipPurchase]
    pageInfo: PageInfo
    totalCount: Int
  }
  extend type Invoice @key(fields: "_id") {
    _id: String! @external
  }
`;

const planQueryParams = `
  searchValue: String,
  isActive: Boolean,
`;

const purchaseQueryParams = `
  userId: String,
  isExpired: Boolean,
  isInGracePeriod: Boolean,
`;

const membershipPurchaseQueryParams = `
  userId: String,
  status: String,
  planId: String,
`;

const cpMembershipPurchaseQueryParams = `
  status: String,
  planId: String,
`;

import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const queries = `
  oneFitMembershipPlans(${planQueryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitMembershipPlanListResponse
  oneFitMembershipPlansCount(${planQueryParams}): Int
  oneFitMembershipPlan(_id: String): OneFitMembershipPlan
  oneFitActiveMembershipPlans: [OneFitMembershipPlan]
  oneFitMembershipPurchases(${membershipPurchaseQueryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitMembershipPurchaseListResponse
  oneFitMembershipPurchase(_id: String): OneFitMembershipPurchase
  cpOneFitMembershipPurchases(${cpMembershipPurchaseQueryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitMembershipPurchaseListResponse
  cpOneFitMembershipPurchase(_id: String!): OneFitMembershipPurchase

`;

const planInput = `
  name: String!
  description: String
  creditAmount: Float!
  duration: Int!
  price: Float!
  isActive: Boolean
`;

const planUpdateInput = `
  name: String
  description: String
  creditAmount: Float
  duration: Int
  price: Float
  isActive: Boolean
`;

const purchaseInput = `
  userId: String!
  planId: String!
  paymentId: String!
`;

const cpPurchaseInput = `
  planId: String!
  paymentId: String!
`;

export const mutations = `
  oneFitMembershipPlanCreate(${planInput}): OneFitMembershipPlan
  oneFitMembershipPlanUpdate(_id: String!, ${planUpdateInput}): OneFitMembershipPlan
  oneFitMembershipPlansRemove(ids: [String]!): JSON
  oneFitMembershipPurchaseCreate(${purchaseInput}): OneFitMembershipPurchase
  oneFitMembershipPurchaseActivate(_id: String!): OneFitMembershipPurchase
  cpOneFitMembershipPurchaseCreate(${cpPurchaseInput}): OneFitMembershipPurchase
  cpOneFitMembershipPurchaseActivate(_id: String!): OneFitMembershipPurchase

`;
