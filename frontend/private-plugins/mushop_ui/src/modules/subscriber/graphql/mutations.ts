import { gql } from '@apollo/client';

export const MUSHOP_CANCEL_SUBSCRIPTION = gql`
  mutation MushopCancelSubscription($_id: String!) {
    mushopCancelSubscription(_id: $_id) {
      _id
      status
    }
  }
`;

export const MUSHOP_UPDATE_SUBSCRIPTION_END_DATE = gql`
  mutation MushopUpdateSubscriptionEndDate($_id: String!, $endDate: Date!) {
    mushopUpdateSubscriptionEndDate(_id: $_id, endDate: $endDate) {
      _id
      status
      endDate
    }
  }
`;

export const MUSHOP_GRANT_SUBSCRIPTION = gql`
  mutation MushopGrantSubscription(
    $customerId: String!
    $planId: String!
    $paymentId: String
    $amount: Float
  ) {
    mushopGrantSubscription(
      customerId: $customerId
      planId: $planId
      paymentId: $paymentId
      amount: $amount
    ) {
      _id
      customerId
      planId
      status
      startDate
      endDate
      invoiceId
    }
  }
`;
