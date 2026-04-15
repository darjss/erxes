import { gql } from '@apollo/client';

export const MUSHOP_CANCEL_SUBSCRIPTION = gql`
  mutation MushopCancelSubscription($_id: String!) {
    mushopCancelSubscription(_id: $_id) {
      _id
      status
    }
  }
`;
