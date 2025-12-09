import { gql } from '@apollo/client';
import { GQL_CURSOR_PARAM_DEFS, GQL_CURSOR_PARAMS } from 'erxes-ui';

export const ONE_FIT_ACTIVITY_CATEGORIES = gql`
  query OneFitActivityCategories(
    $searchValue: String
    $name: String
    $parentId: String
    $isActive: Boolean
    ${GQL_CURSOR_PARAM_DEFS}
  ) {
    oneFitActivityCategories(
      searchValue: $searchValue
      name: $name
      parentId: $parentId
      isActive: $isActive
      ${GQL_CURSOR_PARAMS}
    ) {
      list {
        _id
        createdAt
        modifiedAt
        name
        description
        parentId
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

export const ONE_FIT_ACTIVITY_CATEGORIES_COUNT = gql`
  query OneFitActivityCategoriesCount(
    $searchValue: String
    $name: String
    $parentId: String
    $isActive: Boolean
  ) {
    oneFitActivityCategoriesCount(
      searchValue: $searchValue
      name: $name
      parentId: $parentId
      isActive: $isActive
    )
  }
`;

export const ONE_FIT_ACTIVITY_CATEGORY = gql`
  query OneFitActivityCategory($_id: String!) {
    oneFitActivityCategory(_id: $_id) {
      _id
      createdAt
      modifiedAt
      name
      description
      parentId
      isActive
    }
  }
`;

