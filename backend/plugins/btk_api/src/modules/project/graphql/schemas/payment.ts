export const types = `
  enum BtkProjectPaymentPlanType {
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

  enum BtkProjectPaymentPlanFrequency {
    CUSTOM
    ONE_TIME
    ONE_TIME_PER_MONTH
    TOW_TIME_PER_MONTH
    THREE_TIME_PER_MONTH
    QUARTERLY
    HALF_YEARLY
    YEARLY
  }

  enum BtkProjectPaymentPlanInterestType {
    SIMPLE
    FLAT
    REDUCING
  }

  type BtkProjectPaymentPlan {
    _id: ID!
    name: String
    type: BtkProjectPaymentPlanType!
    downPaymentPercentage: Float
    interestPercentage: Float
    interestType: BtkProjectPaymentPlanInterestType
    advancePaymentPercentage: Float
    discountPercentage: Float
    project: ID!
    description: String
    installment: Int
    frequency: BtkProjectPaymentPlanFrequency
    penaltyPercentage: Float
    vatIncluded: Boolean
  }

  input BtkProjectPaymentPlanInput {
    name: String
    type: BtkProjectPaymentPlanType!
    downPaymentPercentage: Float
    interestPercentage: Float
    advancePaymentPercentage: Float
    discountPercentage: Float
    project: ID!
    description: String
    installment: Int
    frequency: BtkProjectPaymentPlanFrequency
    penaltyPercentage: Float
    vatIncluded: Boolean
  }
`;

export const queries = `
  btkGetProjectPaymentPlans(project: String!): [BtkProjectPaymentPlan]
`;

export const mutations = `
  btkCreateProjectPaymentPlan(input: BtkProjectPaymentPlanInput!): BtkProjectPaymentPlan
  btkUpdateProjectPaymentPlan(_id: String!, input: BtkProjectPaymentPlanInput!): BtkProjectPaymentPlan
`;
