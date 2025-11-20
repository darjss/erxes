export const types = `
  enum BtkAdminNewsPaymentPlanType {
    RESERVATION
    PRE_SALE
    HIRE_PURCHASE
    LOAN_RESERVATION
    INTEREST_FREE_HIRE
    BARTER
    BANK_HOUSING_LOAN
    BANK_MORTGAGE
    SALE
    SALE_BARTER
  }

  enum BtkAdminNewsPaymentPlanFrequency {
    CUSTOM
    ONE_TIME
    ONE_TIME_PER_MONTH
    TOW_TIME_PER_MONTH
    THREE_TIME_PER_MONTH
    QUARTERLY
    HALF_YEARLY
    YEARLY
  }

  enum BtkAdminNewsPaymentPlanInterestType {
    SIMPLE
    FLAT
    REDUCING
  }

  type BtkAdminNewsPaymentPlan {
    _id: ID!
    name: String
    type: BtkAdminNewsPaymentPlanType!
    downPaymentPercentage: Float
    interestPercentage: Float
    interestType: BtkAdminNewsPaymentPlanInterestType
    advancePaymentPercentage: Float
    discountPercentage: Float
    news: ID!
    description: String
    installment: Int
    frequency: BtkAdminNewsPaymentPlanFrequency
    penaltyPercentage: Float
    vatIncluded: Boolean
  }
`;

export const queries = `
  btkAdminGetNewsPaymentPlans(news: String!): [BtkAdminNewsPaymentPlan]
  btkAdminGetNewsPaymentPlan(_id: String!): BtkAdminNewsPaymentPlan
`;
