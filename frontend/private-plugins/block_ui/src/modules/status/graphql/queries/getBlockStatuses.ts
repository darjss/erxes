import { gql } from '@apollo/client';

export const GET_BLOCK_STATUSES = gql`
  query getBlockStatuses($projectId: String!, $type: String) {
    getBlockStatuses(projectId: $projectId, type: $type) {
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
