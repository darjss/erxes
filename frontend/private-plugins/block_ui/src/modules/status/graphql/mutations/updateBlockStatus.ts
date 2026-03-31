import { gql } from '@apollo/client';

export const UPDATE_BLOCK_STATUS = gql`
  mutation updateBlockStatus($_id: String!, $input: BlockStatusInput!) {
    updateBlockStatus(_id: $_id, input: $input) {
      _id
      name
      projectId
      description
      color
      order
      type
    }
  }
`;
