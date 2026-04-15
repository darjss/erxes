import { gql } from '@apollo/client';
import {
  GQL_CURSOR_PARAM_DEFS,
  GQL_CURSOR_PARAMS,
  GQL_PAGE_INFO,
} from 'erxes-ui';

export const GET_LISTING_STATS = gql`
  query GetListingStats {
    blockGetListingStats {
      total
      active
      draft
      totalViews
    }
  }
`;

export const GET_LISTINGS = gql`
  query GetListings(
    $status: String
    $searchValue: String
    $district: String
    $city: String
    ${GQL_CURSOR_PARAM_DEFS}
  ) {
    blockGetListings(
      status: $status
      searchValue: $searchValue
      district: $district
      city: $city
      ${GQL_CURSOR_PARAMS}
    ) {
      list {
        _id
        title
        description
        propertyType
        type
        status
        viewCount
        memberId
        agent {
          _id
          firstName
          lastName
          email
        }
        pricing {
          amount
          currency
        }
        createdAt
      }
      ${GQL_PAGE_INFO}
    }
  }
`;
