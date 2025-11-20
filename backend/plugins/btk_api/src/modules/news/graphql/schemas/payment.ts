export const types = `
  enum BtkNewsPaymentPlanType {
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

  enum BtkNewsPaymentPlanFrequency {
    CUSTOM
    ONE_TIME
    ONE_TIME_PER_MONTH
    TOW_TIME_PER_MONTH
    THREE_TIME_PER_MONTH
    QUARTERLY
    HALF_YEARLY
    YEARLY
  }

  enum BtkNewsPaymentPlanInterestType {
    SIMPLE
    FLAT
    REDUCING
  }

  type BtkNewsPaymentPlan {
    _id: ID!
    name: String
    type: BtkNewsPaymentPlanType!
    downPaymentPercentage: Float
    interestPercentage: Float
    interestType: BtkNewsPaymentPlanInterestType
    advancePaymentPercentage: Float
    discountPercentage: Float
    news: ID!
    description: String
    installment: Int
    frequency: BtkNewsPaymentPlanFrequency
    penaltyPercentage: Float
    vatIncluded: Boolean
  }

  input BtkNewsPaymentPlanInput {
    name: String
    type: BtkNewsPaymentPlanType!
    downPaymentPercentage: Float
    interestPercentage: Float
    advancePaymentPercentage: Float
    discountPercentage: Float
    news: ID!
    description: String
    installment: Int
    frequency: BtkNewsPaymentPlanFrequency
    penaltyPercentage: Float
    vatIncluded: Boolean
  }
`;

export const queries = `
  btkGetNewsPaymentPlans(news: String!): [BtkNewsPaymentPlan]
`;

export const mutations = `
  btkCreateNewsPaymentPlan(input: BtkNewsPaymentPlanInput!): BtkNewsPaymentPlan
  btkUpdateNewsPaymentPlan(_id: String!, input: BtkNewsPaymentPlanInput!): BtkNewsPaymentPlan
`;
