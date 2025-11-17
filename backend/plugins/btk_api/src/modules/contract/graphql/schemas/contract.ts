export const types = `
  enum BtkContractPartyType {
    customer
    company
  }

  enum BtkContractStatus {
    draft
    signed
    completed
    cancelled
  }

  enum BtkContractInterestType {
    SIMPLE
    FLAT
    REDUCING
  }

  type BtkContractPaymentPlan {
    type: BtkProjectPaymentPlanType!
    downPaymentPercentage: Float
    interestPercentage: Float
    interestType: BtkContractInterestType
    advancePaymentPercentage: Float
    discountPercentage: Float
    description: String
    installment: Int
    frequency: BtkProjectPaymentPlanFrequency
    penaltyPercentage: Float
    vatIncluded: Boolean
    paymentDates: [Int]
  }

  input BtkContractPaymentPlanInput {
    type: BtkProjectPaymentPlanType!
    downPaymentPercentage: Float
    interestPercentage: Float
    interestType: BtkContractInterestType
    advancePaymentPercentage: Float
    discountPercentage: Float
    description: String
    installment: Int
    frequency: BtkProjectPaymentPlanFrequency
    penaltyPercentage: Float
    vatIncluded: Boolean
    paymentDates: [Int]
  }

  enum BtkContractAmountType {
    perSize
    perUnit
  }

  type BtkContract {
    _id: String
    unit: String!
    number: String
    currency: String
    date: String
    amount: Int
    amountType: BtkContractAmountType
    status: BtkContractStatus
    startDate: String
    endDate: String
    isLifeTime: Boolean
    party: BtkContractParty
    paymentPlan: BtkContractPaymentPlan
    user: String
  }

  type BtkContractParty {
    type: BtkContractPartyType
    id: String
  }

  input BtkContractPartyInput {
    type: BtkContractPartyType
    id: String
  }


  input BtkContractInput {
    unit: String!
    number: String
    currency: String
    date: String
    amount: Int
    amountType: BtkContractAmountType
    status: BtkContractStatus
    startDate: String
    endDate: String
    isLifeTime: Boolean
    party: BtkContractPartyInput
    paymentPlan: BtkContractPaymentPlanInput
  }
`;

export const mutations = `
  btkCreateContract(input: BtkContractInput!): BtkContract
  btkUpdateContract(_id: String!, input: BtkContractInput!): BtkContract
`;

export const queries = `
  btkGetContract(_id: String!): BtkContract
  btkGetContracts(unit: String): [BtkContract]
`;
