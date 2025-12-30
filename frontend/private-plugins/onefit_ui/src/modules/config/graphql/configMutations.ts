import { gql } from '@apollo/client';

export const ONE_FIT_SYSTEM_CONFIG_UPDATE_SELECTED_PAYMENTS = gql`
  mutation OneFitSystemConfigUpdateSelectedPayments($paymentIds: [String]!) {
    oneFitSystemConfigUpdateSelectedPayments(paymentIds: $paymentIds) {
      _id
      createdAt
      modifiedAt
      key
      value
      description
    }
  }
`;

