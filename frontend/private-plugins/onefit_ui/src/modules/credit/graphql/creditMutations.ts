import { gql } from '@apollo/client';

export const ONE_FIT_CREDIT_TRANSACTIONS_REMOVE = gql`
  mutation OneFitCreditTransactionsRemove($ids: [String]!) {
    oneFitCreditTransactionsRemove(ids: $ids)
  }
`;

export const ONE_FIT_CREDIT_TRANSACTION_CREATE = gql`
  mutation OneFitCreditTransactionCreate(
    $userId: String!
    $amount: Float!
    $transactionType: OneFitCreditTransactionType!
    $source: OneFitCreditSource!
    $bookingId: String
    $corporateCreditId: String
    $membershipPlanId: String
    $description: String
  ) {
    oneFitCreditTransactionCreate(
      userId: $userId
      amount: $amount
      transactionType: $transactionType
      source: $source
      bookingId: $bookingId
      corporateCreditId: $corporateCreditId
      membershipPlanId: $membershipPlanId
      description: $description
    ) {
      _id
      createdAt
      userId
      amount
      transactionType
      source
      bookingId
      corporateCreditId
      description
      balanceAfter
    }
  }
`;
