import { gql } from '@apollo/client';
import { GQL_CURSOR_PARAM_DEFS, GQL_CURSOR_PARAMS } from 'erxes-ui';

export const ONE_FIT_MEMBERSHIP_PURCHASES = gql`
  query OneFitMembershipPurchases(
    $userId: String
    $status: String
    $planId: String
    ${GQL_CURSOR_PARAM_DEFS}
  ) {
    oneFitMembershipPurchases(
      userId: $userId
      status: $status
      planId: $planId
      ${GQL_CURSOR_PARAMS}
    ) {
      list {
        _id
        createdAt
        modifiedAt
        userId
        user {
          _id
          firstName
          lastName
          primaryEmail
          primaryPhone
        }
        planId
        status
        purchasedAt
        paidAt
        activatedAt
        expiresAt
        amount
        invoiceId
        promoCodeId
        promoCode {
          _id
          code
        }
        plan {
          _id
          name
          creditAmount
          duration
          price
          isActive
        }
        invoice
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

export const ONE_FIT_MEMBERSHIP_PURCHASE = gql`
  query OneFitMembershipPurchase($_id: String!) {
    oneFitMembershipPurchase(_id: $_id) {
      _id
      createdAt
      modifiedAt
      userId
      user {
        _id
        firstName
        lastName
        primaryEmail
        primaryPhone
      }
      planId
      status
      purchasedAt
      paidAt
      activatedAt
      expiresAt
      amount
      invoiceId
      promoCodeId
      promoCode {
        _id
        code
      }
      plan {
        _id
        name
        creditAmount
        duration
        price
        isActive
      }
      invoice
    }
  }
`;
