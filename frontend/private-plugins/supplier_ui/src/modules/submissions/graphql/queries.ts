import { gql } from '@apollo/client';

export const PLATFORM_SUBMISSIONS = gql`
  query Submissions($status: String, $limit: Int, $cursor: String, $direction: String) {
    submissions(status: $status, limit: $limit, cursor: $cursor, direction: $direction) {
      list {
        _id
        productId
        supplierId
        status
        note
        offering {
          price
          stock
          minBuyCount
          maxBuyCount
          groupBuyMinCount
          groupBuyDiscount
          warrantyDuration
        }
        submittedAt
        decidedAt
      }
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
