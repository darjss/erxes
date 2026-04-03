import { gql } from '@apollo/client';

export const UPDATE_BLOCK_STATUS_ORDER = gql`
  mutation updateBlockOpptyStatusOrder($_id: String!, $order: Float!) {
    updateBlockOpptyStatusOrder(_id: $_id, order: $order) {
      _id
      order
    }
  }
`;
