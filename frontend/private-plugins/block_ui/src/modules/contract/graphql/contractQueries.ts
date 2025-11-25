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
      }
      user
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
      }
      user
    }
  }
`;
