import { gql } from '@apollo/client';
import { GQL_CURSOR_PARAM_DEFS, GQL_CURSOR_PARAMS } from 'erxes-ui';

export const MUSHOP_SUBSCRIPTION_PLANS = gql`
  query MushopSubscriptionPlans(
    $searchValue: String
    $isActive: Boolean
    ${GQL_CURSOR_PARAM_DEFS}
  ) {
    mushopSubscriptionPlans(
      searchValue: $searchValue
      isActive: $isActive
      ${GQL_CURSOR_PARAMS}
    ) {
      list {
        _id
        name
        description
        price
        currency
        durationMonths
        isActive
      }
      totalCount
    }
  }
`;

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
