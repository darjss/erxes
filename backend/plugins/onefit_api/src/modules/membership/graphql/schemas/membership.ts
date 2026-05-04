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
    saleOptions: [OneFitMembershipSaleOption!]
    isActive: Boolean
  }

  type OneFitMembershipSaleOption {
    quantity: Int!
    discountPercent: Float
    finalPrice: Float
  }

  input OneFitMembershipSaleOptionInput {
    quantity: Int!
    discountPercent: Float
    finalPrice: Float
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
    companyId: String
    user: Customer
    company: Company
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

  enum OneFitMembershipPurchaseReportInterval {
    day
    week
    month
  }

  type OneFitMembershipPurchaseReportBucket {
    periodKey: String!
    purchaseCount: Int!
    totalAmount: Float!
  }

  type OneFitMembershipPurchasePlanShare {
    planId: String!
    planName: String!
    purchaseCount: Int!
    percent: Float!
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
  companyId: String,
  status: String,
  planId: String,
  isActivated: Boolean,
  isNeedActivation: Boolean,
  orderBy: JSON,
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
  oneFitMembershipPurchaseReport(startDate: Date!, endDate: Date!, interval: OneFitMembershipPurchaseReportInterval!): [OneFitMembershipPurchaseReportBucket!]!
  oneFitMembershipPurchasePlanShares(startDate: Date!, endDate: Date!): [OneFitMembershipPurchasePlanShare!]!
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
  saleOptions: [OneFitMembershipSaleOptionInput!]
  isActive: Boolean
`;

const planUpdateInput = `
  name: String
  description: String
  creditAmount: Float
  planType: OneFitMembershipPlanType
  duration: Int
  price: Float
  saleOptions: [OneFitMembershipSaleOptionInput!]
  isActive: Boolean
`;

const purchaseInput = `
  userId: String!
  planId: String!
  quantity: Int
  promoCode: String
  promoCodeId: String
  removePreviousCredits: Boolean
`;

const bulkPurchaseInput = `
  userIds: [String]!
  planId: String!
  quantity: Int
  companyId: String
  promoCode: String
  promoCodeId: String
  removePreviousCredits: Boolean
`;

const cpPurchaseInput = `
  planId: String!
  quantity: Int
  promoCode: String
  promoCodeId: String
  removePreviousCredits: Boolean
`;

export const mutations = `
  oneFitMembershipPlanCreate(${planInput}): OneFitMembershipPlan
  oneFitMembershipPlanUpdate(_id: String!, ${planUpdateInput}): OneFitMembershipPlan
  oneFitMembershipPlansRemove(ids: [String]!): JSON
  oneFitMembershipPurchaseCreate(${purchaseInput}): OneFitMembershipPurchase
  oneFitMembershipPurchasesBulkCreate(${bulkPurchaseInput}): [OneFitMembershipPurchase]
  oneFitMembershipPurchaseActivate(_id: String!): OneFitMembershipPurchase
  oneFitMembershipPurchaseCompanyUpdate(_id: String!, companyId: String): OneFitMembershipPurchase
  oneFitMembershipPurchaseRemove(_id: String!): JSON
  cpOneFitMembershipPurchaseCreate(${cpPurchaseInput}): OneFitMembershipPurchase
  cpOneFitMembershipPurchaseActivate(_id: String!): OneFitMembershipPurchase
  cpOneFitMembershipHoldStart(holdDays: Int!): Customer
  cpOneFitMembershipHoldCancel: Customer
  cpOneFitMembershipCheckPromoDiscount(planId: String!, promoCode: String, promoCodeId: String): OneFitPromoDiscountCheck
`;
