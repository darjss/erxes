import { gql } from '@apollo/client';

export const GET_BLOCK_STATUSES = gql`
  query getBlockStatuses($projectId: String!) {
    getBlockStatuses(projectId: $projectId) {
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
