export const types = `
  enum BlockContractPartyType {
    customer
    company
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
    paymentDueDates: [Date]
    firstPaymentDate: Date
    advancePaymentDate: Date
  }

  input BlockContractPaymentPlanInput {
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
    paymentDueDates: [Date]
    firstPaymentDate: Date
    advancePaymentDate: Date
  }

  type BlockContract {
    _id: String
    unit: String!
    number: String
    currency: String
    date: String
    amount: Float
    status: String
    startDate: String
    endDate: String
    party: BlockContractParty
    paymentPlan: BlockContractPaymentPlan
    user: String
  }

  type BlockContractParty {
    type: BlockContractPartyType
    id: String
  }

  input BlockContractPartyInput {
    type: BlockContractPartyType
    id: String
  }


  input BlockContractInput {
    unit: String!
    number: String
    currency: String
    date: String
    amount: Float
    status: String
    startDate: String
    endDate: String
    party: BlockContractPartyInput
    paymentPlan: BlockContractPaymentPlanInput
    user: String
  }
`;

export const mutations = `
  blockCreateContract(input: BlockContractInput!): BlockContract
  blockUpdateContract(_id: String!, input: BlockContractInput!): BlockContract
  blockUpdateContractStatus(_id: String!, status: String!): BlockContract
`;

export const queries = `
  blockGetContract(_id: String!): BlockContract
  blockGetContracts(unit: String): [BlockContract]
  blockGetContractsList(
    filter: BlockContractFilterInput
    limit: Int
    cursor: String
    direction: String
  ): BlockContractListResponse
`;

export const filterInputTypes = `
  input BlockContractFilterInput {
    projectId: String
    search: String
    status: String
    partyType: String
    currency: String
    dateFrom: String
    dateTo: String
    user: String
  }

  type BlockContractListResponse {
    list: [BlockContract]
    pageInfo: PageInfo
    totalCount: Int
  }
`;
