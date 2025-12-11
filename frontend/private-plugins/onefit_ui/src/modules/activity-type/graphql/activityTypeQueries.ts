import { gql } from '@apollo/client';
import { GQL_CURSOR_PARAM_DEFS, GQL_CURSOR_PARAMS } from 'erxes-ui';

export const ONE_FIT_ACTIVITY_TYPES = gql`
  query OneFitActivityTypes(
    $searchValue: String
    $providerId: String
    $categoryId: String
    $genderRestriction: OneFitGenderRestriction
    $isActive: Boolean
    ${GQL_CURSOR_PARAM_DEFS}
  ) {
    oneFitActivityTypes(
      searchValue: $searchValue
      providerId: $providerId
      categoryId: $categoryId
      genderRestriction: $genderRestriction
      isActive: $isActive
      ${GQL_CURSOR_PARAMS}
    ) {
      list {
        _id
        createdAt
        modifiedAt
        providerId
        provider {
          _id
          businessName
        }
        name {
          en
          mn
        }
        description {
          en
          mn
        }
        creditCost
        duration
        genderRestriction
        categoryIds
        categories {
          _id
          name
        }
        isActive
        cancellationDeadline
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

export const ONE_FIT_ACTIVITY_TYPES_COUNT = gql`
  query OneFitActivityTypesCount(
    $searchValue: String
    $providerId: String
    $categoryId: String
    $genderRestriction: OneFitGenderRestriction
    $isActive: Boolean
  ) {
    oneFitActivityTypesCount(
      searchValue: $searchValue
      providerId: $providerId
      categoryId: $categoryId
      genderRestriction: $genderRestriction
      isActive: $isActive
    )
  }
`;

export const ONE_FIT_ACTIVITY_TYPE = gql`
  query OneFitActivityType($_id: String!) {
    oneFitActivityType(_id: $_id) {
      _id
      createdAt
      modifiedAt
      providerId
      provider {
        _id
        businessName
      }
      name {
        en
        mn
      }
      description {
        en
        mn
      }
      creditCost
      duration
      genderRestriction
      categoryIds
      categories {
        _id
        name
      }
      isActive
      cancellationDeadline
    }
  }
`;
