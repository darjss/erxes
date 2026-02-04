import { gql } from '@apollo/client';

export const ONE_FIT_MEMBERSHIP_PURCHASE_CREATE = gql`
  mutation OneFitMembershipPurchaseCreate(
    $userId: String!
    $planId: String!
    $promoCode: String
    $promoCodeId: String
  ) {
    oneFitMembershipPurchaseCreate(
      userId: $userId
      planId: $planId
      promoCode: $promoCode
      promoCodeId: $promoCodeId
    ) {
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

export const ONE_FIT_MEMBERSHIP_PURCHASE_ACTIVATE = gql`
  mutation OneFitMembershipPurchaseActivate($_id: String!) {
    oneFitMembershipPurchaseActivate(_id: $_id) {
      _id
      modifiedAt
      status
      paidAt
      activatedAt
      expiresAt
      invoiceId
      user {
        _id
        firstName
        lastName
        primaryEmail
        primaryPhone
      }
      plan {
        _id
        name
        creditAmount
        duration
        price
      }
      invoice
    }
  }
`;
