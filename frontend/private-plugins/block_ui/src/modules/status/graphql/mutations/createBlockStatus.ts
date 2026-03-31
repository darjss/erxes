import { gql } from '@apollo/client';

export const CREATE_BLOCK_STATUS = gql`
  mutation createBlockStatus($input: BlockStatusInput!) {
    createBlockStatus(input: $input) {
      _id
      name
      projectId
      description
      color
      order
      type
      createdAt
      updatedAt
    }
  }
`;
