import { gql } from '@apollo/client';
import { GQL_CURSOR_PARAM_DEFS, GQL_CURSOR_PARAMS } from 'erxes-ui';

export const ONE_FIT_PROVIDERS = gql`
  query MtoProviders(
    $searchValue: String
    $status: String
    $categoryId: String
    $isActive: Boolean
    ${GQL_CURSOR_PARAM_DEFS}
  ) {
    mtoProviders(
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
        instanceId
        businessName {
          en
          mn
        }
        description {
          en
          mn
        }
        contactInfo {
          phone
          email
          website
        }
        facilities
        categoryIds
        categories {
          _id
          name {
            en
            mn
          }
        }
        singleProviderLimit
        status
        rejectionReason
        approvedAt
        approvedBy
        rejectedBy
        isActive
        icon
        coverImages
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
  query MtoProvidersCount(
    $searchValue: String
    $status: String
    $categoryId: String
    $isActive: Boolean
  ) {
    mtoProvidersCount(
      searchValue: $searchValue
      status: $status
      categoryId: $categoryId
      isActive: $isActive
    )
  }
`;

export const ONE_FIT_PROVIDER = gql`
  query MtoProvider($_id: String!) {
    mtoProvider(_id: $_id) {
      _id
      createdAt
      modifiedAt
      instanceId
      businessName {
        en
        mn
      }
      description {
        en
        mn
      }
      contactInfo {
        phone
        email
        website
      }
      facilities
      categoryIds
      categories {
        _id
        name {
          en
          mn
        }
      }
      singleProviderLimit
      status
      rejectionReason
      approvedAt
      approvedBy
      rejectedBy
      isActive
      icon
      coverImages
    }
  }
`;
