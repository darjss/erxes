import { gql } from '@apollo/client';

export const GET_BLOCK_STATUS_TYPES = gql`
  query getBlockStatusTypes($projectId: String!) {
    getBlockStatusTypes(projectId: $projectId) {
      _id
      name
      projectId
      color
      order
    }
  }
`;
