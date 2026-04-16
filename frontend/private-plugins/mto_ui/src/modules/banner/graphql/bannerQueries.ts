import { gql } from '@apollo/client';
import { GQL_CURSOR_PARAM_DEFS, GQL_CURSOR_PARAMS } from 'erxes-ui';

export const ONE_FIT_BANNERS = gql`
  query MtoBanners(
    $providerId: String
    $type: String
    $status: String
    ${GQL_CURSOR_PARAM_DEFS}
  ) {
    mtoBanners(
      providerId: $providerId
      type: $type
      status: $status
      ${GQL_CURSOR_PARAMS}
    ) {
      list {
        _id
        createdAt
        modifiedAt
        image
        providerId
        type
        status
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const ONE_FIT_BANNERS_COUNT = gql`
  query MtoBannersCount($providerId: String, $type: String, $status: String) {
    mtoBannersCount(providerId: $providerId, type: $type, status: $status)
  }
`;

export const ONE_FIT_BANNER = gql`
  query MtoBanner($_id: String!) {
    mtoBanner(_id: $_id) {
      _id
      createdAt
      modifiedAt
      image
      providerId
      type
      status
    }
  }
`;
