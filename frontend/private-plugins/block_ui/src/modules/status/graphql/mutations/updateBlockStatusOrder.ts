import { gql } from '@apollo/client';

export const UPDATE_BLOCK_STATUS_ORDER = gql`
  mutation updateBlockStatusOrder($_id: String!, $order: Float!) {
    updateBlockStatusOrder(_id: $_id, order: $order) {
      _id
      order
    }
  }
`;
