export const types = `
  enum OneFitMembershipPlanType {
    normal
    credit
  }

  type OneFitMembershipPlan {
    _id: String
    createdAt: Date
    modifiedAt: Date
    name: String
    description: String
    creditAmount: Float
    planType: OneFitMembershipPlanType
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
    user: Customer
    planId: String
    status: String
    purchasedAt: Date
    paidAt: Date
    activatedAt: Date
    expiresAt: Date
    amount: Float
    invoiceId: String
    promoCodeId: String
    promoCode: OneFitPromoCode
    plan: OneFitMembershipPlan
    invoice: JSON
    removePreviousCredits: Boolean
  }

  type OneFitMembershipPurchaseListResponse {
    list: [OneFitMembershipPurchase]
    pageInfo: PageInfo
    totalCount: Int
  }

  type OneFitPromoDiscountCheck {
    valid: Boolean!
    originalPrice: Float
    discountedAmount: Float
    promoCodeId: String
    discountType: OneFitPromoCodeDiscountType
    value: Float
    error: String
  }
`;

const planQueryParams = `
  searchValue: String,
  isActive: Boolean,
  planType: OneFitMembershipPlanType,
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
  planType: OneFitMembershipPlanType
  duration: Int
  price: Float!
  isActive: Boolean
`;

const planUpdateInput = `
  name: String
  description: String
  creditAmount: Float
  planType: OneFitMembershipPlanType
  duration: Int
  price: Float
  isActive: Boolean
`;

const purchaseInput = `
  userId: String!
  planId: String!
  promoCode: String
  promoCodeId: String
  removePreviousCredits: Boolean
`;

const cpPurchaseInput = `
  planId: String!
  promoCode: String
  promoCodeId: String
  removePreviousCredits: Boolean
`;

export const mutations = `
  oneFitMembershipPlanCreate(${planInput}): OneFitMembershipPlan
  oneFitMembershipPlanUpdate(_id: String!, ${planUpdateInput}): OneFitMembershipPlan
  oneFitMembershipPlansRemove(ids: [String]!): JSON
  oneFitMembershipPurchaseCreate(${purchaseInput}): OneFitMembershipPurchase
  oneFitMembershipPurchaseActivate(_id: String!): OneFitMembershipPurchase
  cpOneFitMembershipPurchaseCreate(${cpPurchaseInput}): OneFitMembershipPurchase
  cpOneFitMembershipPurchaseActivate(_id: String!): OneFitMembershipPurchase
  cpOneFitMembershipHoldStart(holdDays: Int!): Customer
  cpOneFitMembershipHoldCancel: Customer
  cpOneFitMembershipCheckPromoDiscount(planId: String!, promoCode: String, promoCodeId: String): OneFitPromoDiscountCheck
`;
