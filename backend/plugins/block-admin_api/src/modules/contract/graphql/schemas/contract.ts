export const types = `
  enum BlockContractPartyType {
    customer
    company
  }

  enum BlockContractStatus {
    draft
    signed
    completed
    cancelled
  }

  enum BlockContractInterestType {
    SIMPLE
    FLAT
    REDUCING
  }

  type BlockContractPaymentPlan {
    type: BlockProjectPaymentPlanType!
    downPaymentPercentage: Float
    interestPercentage: Float
    interestType: BlockContractInterestType
    advancePaymentPercentage: Float
    discountPercentage: Float
    description: String
    installment: Int
    frequency: BlockProjectPaymentPlanFrequency
    penaltyPercentage: Float
    vatIncluded: Boolean
    paymentDates: [Int]
  }

  enum BlockContractAmountType {
    perSize
    perUnit
  }

  type BlockContract {
    _id: String
    unit: String!
    number: String
    currency: String
    date: String
    amount: Int
    amountType: BlockContractAmountType
    status: BlockContractStatus
    startDate: String
    endDate: String
    isLifeTime: Boolean
    party: BlockContractParty
    paymentPlan: BlockContractPaymentPlan
    user: String
  }

  type BlockContractParty {
    type: BlockContractPartyType
    id: String
  }
`;

export const queries = `
  blockGetContract(_id: String!): BlockContract
  blockGetContracts(unit: String): [BlockContract]
`;
