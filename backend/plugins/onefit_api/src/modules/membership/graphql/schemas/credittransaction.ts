import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  enum OneFitCreditTransactionType {
    purchase
    usage
    refund
    expiration
  }

  enum OneFitCreditSource {
    individual
    corporate
  }

  type OneFitCreditTransaction {
    _id: String
    createdAt: Date
    userId: String
    user: Customer
    amount: Float
    transactionType: OneFitCreditTransactionType
    source: OneFitCreditSource
    bookingId: String
    corporateCreditId: String
    description: String
    balanceAfter: Float
  }

  type OneFitCreditTransactionListResponse {
    list: [OneFitCreditTransaction]
    pageInfo: PageInfo
    totalCount: Int
  }

  type OneFitCreditBalance {
    userId: String
    balance: Float
    individualBalance: Float
    corporateBalance: Float
  }
`;

const transactionQueryParams = `
  userId: String,
  transactionType: OneFitCreditTransactionType,
  source: OneFitCreditSource,
  bookingId: String,
`;

export const queries = `
  oneFitCreditTransactions(${transactionQueryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitCreditTransactionListResponse
  oneFitCreditTransactionsCount(${transactionQueryParams}): Int
  oneFitCreditTransaction(_id: String): OneFitCreditTransaction
  oneFitUserCreditBalance(userId: String!): OneFitCreditBalance
  oneFitUserCreditTransactions(userId: String!, limit: Int): [OneFitCreditTransaction]
`;

export const mutations = `
  oneFitCreditTransactionsRemove(ids: [String]!): JSON
  oneFitCreditTransactionCreate(
    userId: String!
    amount: Float!
    transactionType: OneFitCreditTransactionType!
    source: OneFitCreditSource!
    bookingId: String
    corporateCreditId: String
    membershipPlanId: String
    description: String
  ): OneFitCreditTransaction
`;
