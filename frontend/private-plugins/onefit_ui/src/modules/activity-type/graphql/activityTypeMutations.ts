import { gql } from '@apollo/client';

export const ONE_FIT_ACTIVITY_TYPE_CREATE = gql`
  mutation OneFitActivityTypeCreate(
    $providerId: String!
    $name: String!
    $description: String
    $creditCost: Float!
    $duration: Int!
    $genderRestriction: OneFitGenderRestriction!
    $categoryIds: [String]!
    $isActive: Boolean
    $cancellationDeadline: Int
  ) {
    oneFitActivityTypeCreate(
      providerId: $providerId
      name: $name
      description: $description
      creditCost: $creditCost
      duration: $duration
      genderRestriction: $genderRestriction
      categoryIds: $categoryIds
      isActive: $isActive
      cancellationDeadline: $cancellationDeadline
    ) {
      _id
      createdAt
      modifiedAt
      providerId
      name
      description
      creditCost
      duration
      genderRestriction
      categoryIds
      isActive
      cancellationDeadline
    }
  }
`;

export const ONE_FIT_ACTIVITY_TYPE_UPDATE = gql`
  mutation OneFitActivityTypeUpdate(
    $_id: String!
    $name: String
    $description: String
    $creditCost: Float
    $duration: Int
    $genderRestriction: OneFitGenderRestriction
    $categoryIds: [String]
    $isActive: Boolean
    $cancellationDeadline: Int
  ) {
    oneFitActivityTypeUpdate(
      _id: $_id
      name: $name
      description: $description
      creditCost: $creditCost
      duration: $duration
      genderRestriction: $genderRestriction
      categoryIds: $categoryIds
      isActive: $isActive
      cancellationDeadline: $cancellationDeadline
    ) {
      _id
      modifiedAt
      name
      description
      creditCost
      duration
      genderRestriction
      categoryIds
      isActive
      cancellationDeadline
    }
  }
`;

export const ONE_FIT_ACTIVITY_TYPES_REMOVE = gql`
  mutation OneFitActivityTypesRemove($ids: [String]!) {
    oneFitActivityTypesRemove(ids: $ids)
  }
`;







