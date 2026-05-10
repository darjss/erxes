import { gql } from '@apollo/client';
import { GQL_CURSOR_PARAM_DEFS, GQL_CURSOR_PARAMS } from 'erxes-ui';

const SUBSCRIBER_FIELDS = `
  _id
  customerId
  plan {
    _id
    name
    description
    price
    currency
    durationMonths
    isActive
  }
  status
  startDate
  endDate
  amount
  currency
  invoiceId
  customer
  createdAt
  updatedAt
`;

export const MUSHOP_SUBSCRIPTIONS = gql`
  query MushopSubscriptions(
    $searchValue: String
    $status: String
    ${GQL_CURSOR_PARAM_DEFS}
  ) {
    mushopSubscriptions(
      searchValue: $searchValue
      status: $status
      ${GQL_CURSOR_PARAMS}
    ) {
      list {
        ${SUBSCRIBER_FIELDS}
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const MUSHOP_SUBSCRIPTION_DETAIL = gql`
  query MushopSubscriptionDetail($_id: String!) {
    mushopSubscriptionDetail(_id: $_id) {
      ${SUBSCRIBER_FIELDS}
    }
  }
`;
