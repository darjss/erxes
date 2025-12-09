import { gql } from '@apollo/client';

export const ONE_FIT_ACTIVITY_CATEGORY_CREATE = gql`
  mutation OneFitActivityCategoryCreate(
    $name: String!
    $description: String
    $parentId: String
    $isActive: Boolean
  ) {
    oneFitActivityCategoryCreate(
      name: $name
      description: $description
      parentId: $parentId
      isActive: $isActive
    ) {
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

export const ONE_FIT_ACTIVITY_CATEGORY_UPDATE = gql`
  mutation OneFitActivityCategoryUpdate(
    $_id: String!
    $name: String!
    $description: String
    $parentId: String
    $isActive: Boolean
  ) {
    oneFitActivityCategoryUpdate(
      _id: $_id
      name: $name
      description: $description
      parentId: $parentId
      isActive: $isActive
    ) {
      _id
      modifiedAt
      name
      description
      parentId
      isActive
    }
  }
`;

export const ONE_FIT_ACTIVITY_CATEGORIES_REMOVE = gql`
  mutation OneFitActivityCategoriesRemove($ids: [String]!) {
    oneFitActivityCategoriesRemove(ids: $ids)
  }
`;
