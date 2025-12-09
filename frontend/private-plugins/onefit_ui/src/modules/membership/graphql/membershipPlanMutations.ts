import { gql } from '@apollo/client';

export const ONE_FIT_MEMBERSHIP_PLAN_CREATE = gql`
  mutation OneFitMembershipPlanCreate(
    $name: String!
    $description: String
    $creditAmount: Float!
    $duration: Int!
    $price: Float!
    $isActive: Boolean
  ) {
    oneFitMembershipPlanCreate(
      name: $name
      description: $description
      creditAmount: $creditAmount
      duration: $duration
      price: $price
      isActive: $isActive
    ) {
      _id
      createdAt
      modifiedAt
      name
      description
      creditAmount
      duration
      price
      isActive
    }
  }
`;

export const ONE_FIT_MEMBERSHIP_PLAN_UPDATE = gql`
  mutation OneFitMembershipPlanUpdate(
    $_id: String!
    $name: String
    $description: String
    $creditAmount: Float
    $duration: Int
    $price: Float
    $isActive: Boolean
  ) {
    oneFitMembershipPlanUpdate(
      _id: $_id
      name: $name
      description: $description
      creditAmount: $creditAmount
      duration: $duration
      price: $price
      isActive: $isActive
    ) {
      _id
      modifiedAt
      name
      description
      creditAmount
      duration
      price
      isActive
    }
  }
`;

export const ONE_FIT_MEMBERSHIP_PLANS_REMOVE = gql`
  mutation OneFitMembershipPlansRemove($ids: [String]!) {
    oneFitMembershipPlansRemove(ids: $ids)
  }
`;








