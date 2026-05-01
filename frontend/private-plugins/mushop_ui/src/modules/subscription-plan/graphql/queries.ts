import { gql } from '@apollo/client';

export const MUSHOP_SUBSCRIPTION_PLAN_DETAIL = gql`
  query MushopSubscriptionPlanDetail($_id: String!) {
    mushopSubscriptionPlanDetail(_id: $_id) {
      _id
      name
      description
      price
      currency
      durationMonths
      isActive
      createdAt
      updatedAt
    }
  }
`;
