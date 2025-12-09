import { gql } from '@apollo/client';
import { GQL_CURSOR_PARAM_DEFS, GQL_CURSOR_PARAMS } from 'erxes-ui';

export const ONE_FIT_PROVIDERS = gql`
  query OneFitProviders(
    $searchValue: String
    $status: String
    $categoryId: String
    $isActive: Boolean
    ${GQL_CURSOR_PARAM_DEFS}
  ) {
    oneFitProviders(
      searchValue: $searchValue
      status: $status
      categoryId: $categoryId
      isActive: $isActive
      ${GQL_CURSOR_PARAMS}
    ) {
      list {
        _id
        createdAt
        modifiedAt
        businessName
        description
        location {
          address
          city
          district
          coordinates {
            lat
            lng
          }
        }
        contactInfo {
          phone
          email
          website
        }
        facilities
        categoryIds
        status
        rejectionReason
        approvedAt
        approvedBy
        rejectedBy
        isActive
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

export const ONE_FIT_PROVIDERS_COUNT = gql`
  query OneFitProvidersCount(
    $searchValue: String
    $status: String
    $categoryId: String
    $isActive: Boolean
  ) {
    oneFitProvidersCount(
      searchValue: $searchValue
      status: $status
      categoryId: $categoryId
      isActive: $isActive
    )
  }
`;

export const ONE_FIT_PROVIDER = gql`
  query OneFitProvider($_id: String!) {
    oneFitProvider(_id: $_id) {
      _id
      createdAt
      modifiedAt
      businessName
      description
      location {
        address
        city
        district
        coordinates {
          lat
          lng
        }
      }
      contactInfo {
        phone
        email
        website
      }
      facilities
      categoryIds
      status
      rejectionReason
      approvedAt
      approvedBy
      rejectedBy
      isActive
    }
  }
`;
