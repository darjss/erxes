import { gql } from '@apollo/client';

export const REMOVE_BLOCK_STATUS = gql`
  mutation removeBlockStatus($_id: String!) {
    removeBlockStatus(_id: $_id) {
      _id
    }
  }
`;
