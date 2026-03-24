import { gql } from '@apollo/client';

export const ACTIVITIES_QUERY = gql`
  query BlockGetActivities(
    $contentId: String!
    $limit: Int
    $cursor: String
    $direction: CURSOR_DIRECTION
  ) {
    blockActivities(
      contentId: $contentId
      limit: $limit
      cursor: $cursor
      direction: $direction
    ) {
      list {
        _id
        action
        contentId
        module
        metadata {
          newValue
          previousValue
        }
        createdBy
        createdAt
        updatedAt
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const BLOCK_GET_NOTE_QUERY = gql`
  query BlockGetNote($id: String!) {
    blockGetNote(_id: $id) {
      _id
      content
      contentId
      createdBy
      mentions
      createdAt
      updatedAt
    }
  }
`;
