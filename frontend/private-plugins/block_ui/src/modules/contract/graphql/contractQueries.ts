import { gql } from '@apollo/client';

export const GET_CONTRACTS = gql`
  query BlockGetContracts($unit: String) {
    blockGetContracts(unit: $unit) {
      _id
      number
      unit
      currency
      date
      amount
      amountType
      status
      startDate
      endDate
      isLifeTime
      party {
        type
        id
      }
      paymentPlan {
        type
        downPaymentPercentage
        interestPercentage
        interestType
        advancePaymentPercentage
        discountPercentage
        description
        installment
        frequency
        penaltyPercentage
        vatIncluded
        paymentDates
        paymentDueDates
      }
      user
    }
  }
`;

export const GET_CONTRACTS_LIST = gql`
  query BlockGetContractsList(
    $filter: BlockContractFilterInput
    $limit: Int
    $cursor: String
    $direction: String
  ) {
    blockGetContractsList(
      filter: $filter
      limit: $limit
      cursor: $cursor
      direction: $direction
    ) {
      list {
        _id
        number
        unit
        currency
        date
        amount
        amountType
        status
        startDate
        endDate
        isLifeTime
        party {
          type
          id
        }
        paymentPlan {
          type
        }
        user
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_CONTRACT = gql`
  query BlockGetContract($id: String!) {
    blockGetContract(_id: $id) {
      _id
      number
      unit
      currency
      date
      amount
      amountType
      status
      startDate
      endDate
      isLifeTime
      party {
        type
        id
      }
      paymentPlan {
        type
        downPaymentPercentage
        interestPercentage
        interestType
        advancePaymentPercentage
        discountPercentage
        description
        installment
        frequency
        penaltyPercentage
        vatIncluded
        paymentDates
        paymentDueDates
      }
      user
    }
  }
`;
