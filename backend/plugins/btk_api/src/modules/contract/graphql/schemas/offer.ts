export const types = `
  enum BtkOfferPartyType {
    customer
    company
  }

  enum BtkOfferInterestType {
    SIMPLE
    FLAT
    REDUCING
  }

  type BtkOfferPaymentPlan {
    type: BtkProjectPaymentPlanType!
    downPaymentPercentage: Float
    interestPercentage: Float
    advancePaymentPercentage: Float
    discountPercentage: Float
    description: String
    installment: Int
    frequency: BtkProjectPaymentPlanFrequency
    penaltyPercentage: Float
    vatIncluded: Boolean
    paymentDates: [Int]
    firstPaymentDate: Date
    advancePaymentDate: Date
  }

  input BtkOfferPaymentPlanInput {
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
    firstPaymentDate: Date
    vatIncluded: Boolean
    paymentDates: [Int]
    advancePaymentDate: Date
  }

  enum BtkOfferAmountType {
    priceBySize
    priceBySize
  }

  type BtkOffer {
    _id: String
    unit: String!
    number: String
    currency: String
    date: String
    amount: Float
    amountType: BtkOfferAmountType
    endDate: String
    party: BtkOfferParty
    paymentPlan: BtkOfferPaymentPlan
    user: String
  }

  type BtkOfferParty {
    type: BtkOfferPartyType
    id: String
  }

  input BtkOfferPartyInput {
    type: BtkOfferPartyType
    id: String
  }

  enum BtkOfferStatus {
    draft
    sent
  }

  input BtkOfferInvoicesInput {
    _id: String
    amount: Float
    date: Date
    customDate: String
    description: String
    status: String
    number: Int
    paidDate: Date
  }


  input BtkOfferInput {
    unit: String!
    number: String
    currency: String
    date: String
    amount: Float
    amountType: BtkOfferAmountType
    status: BtkOfferStatus
    endDate: String
    party: BtkOfferPartyInput
    paymentPlan: BtkOfferPaymentPlanInput
    user: String
    description: String

    invoices: [BtkOfferInvoicesInput]
  }
`;

export const mutations = `
  btkCreateOffer(input: BtkOfferInput!): BtkOffer
  btkUpdateOffer(_id: String!, input: BtkOfferInput!): BtkOffer
  btkSendOfferEmail(_id: String!): String
`;

export const queries = `
  btkGetOffer(_id: String!): BtkOffer
  btkGetOffers(unit: String): [BtkOffer]
`;
