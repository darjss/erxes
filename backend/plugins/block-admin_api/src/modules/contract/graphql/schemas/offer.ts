export const types = `
  enum BlockOfferPartyType {
    customer
    company
  }

  enum BlockOfferInterestType {
    SIMPLE
    FLAT
    REDUCING
  }

  type BlockOfferPaymentPlan {
    type: BlockProjectPaymentPlanType!
    downPaymentPercentage: Float
    interestPercentage: Float
    advancePaymentPercentage: Float
    discountPercentage: Float
    description: String
    installment: Int
    frequency: BlockProjectPaymentPlanFrequency
    penaltyPercentage: Float
    vatIncluded: Boolean
    paymentDates: [Int]
    firstPaymentDate: Date
    advancePaymentDate: Date
  }

  enum BlockOfferAmountType {
    priceBySize
    priceBySize
  }

  type BlockOffer {
    _id: String
    unit: String!
    number: String
    currency: String
    date: String
    amount: Float
    amountType: BlockOfferAmountType
    endDate: String
    party: BlockOfferParty
    paymentPlan: BlockOfferPaymentPlan
    user: String
  }

  type BlockOfferParty {
    type: BlockOfferPartyType
    id: String
  }

  enum BlockOfferStatus {
    draft
    sent
  }

  input BlockOfferInvoicesInput {
    _id: String
    amount: Float
    date: Date
    customDate: String
    description: String
    status: String
    number: Int
    paidDate: Date
  }
`;

export const queries = `
  blockGetOffer(_id: String!): BlockOffer
  blockGetOffers(unit: String): [BlockOffer]
`;
