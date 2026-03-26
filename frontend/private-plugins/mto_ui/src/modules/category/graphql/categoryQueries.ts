import { gql } from '@apollo/client';

export const ONE_FIT_ACTIVITY_CATEGORIES = gql`
  query MtoActivityCategories(
    $searchValue: String
    $name: String
    $parentId: String
    $isActive: Boolean
  ) {
    mtoActivityCategories(
      searchValue: $searchValue
      name: $name
      parentId: $parentId
      isActive: $isActive
    ) {
      _id
      createdAt
      modifiedAt
      name {
        en
        mn
      }
      description {
        en
        mn
      }
      parentId
      isActive
      image
      icon
    }
  }
`;
