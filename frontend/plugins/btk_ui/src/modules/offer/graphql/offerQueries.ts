import { gql } from '@apollo/client';

export const GET_OFFERS = gql`
  query BtkGetOffers($unit: String) {
    btkGetOffers(unit: $unit) {
      _id
      amount
      amountType
      currency
      date
      endDate
      number
      party {
        id
        type
      }
      paymentPlan {
        type
        downPaymentPercentage
        interestPercentage
        advancePaymentPercentage
        discountPercentage
        description
        installment
        frequency
        penaltyPercentage
        vatIncluded
        paymentDates
        firstPaymentDate
        advancePaymentDate
      }
      user
    }
  }
`;

export const GET_OFFER = gql`
  query BtkGetOffers($unit: String, $id: String!) {
    btkGetOffers(unit: $unit) {
      _id
      amount
      amountType
      currency
      date
      endDate
      number
      party {
        id
        type
      }
      paymentPlan {
        type
        downPaymentPercentage
        interestPercentage
        advancePaymentPercentage
        discountPercentage
        description
        installment
        frequency
        penaltyPercentage
        vatIncluded
        paymentDates
        firstPaymentDate
        advancePaymentDate
      }
      user
    }
    btkGetOffer(_id: $id) {
      _id
      amount
      amountType
      currency
      date
      endDate
      number
      party {
        id
        type
      }
      paymentPlan {
        type
        downPaymentPercentage
        interestPercentage
        advancePaymentPercentage
        discountPercentage
        description
        installment
        frequency
        penaltyPercentage
        vatIncluded
        paymentDates
        firstPaymentDate
        advancePaymentDate
      }
      unit
      user
    }
  }
`;
