import { gql } from '@apollo/client';

export const ONE_FIT_PROMO_CODE_CREATE = gql`
  mutation OneFitPromoCodeCreate(
    $code: String!
    $discountType: OneFitPromoCodeDiscountType!
    $value: Float!
    $validFrom: Date
    $validTo: Date
    $usageLimit: Int
    $isActive: Boolean
  ) {
    oneFitPromoCodeCreate(
      code: $code
      discountType: $discountType
      value: $value
      validFrom: $validFrom
      validTo: $validTo
      usageLimit: $usageLimit
      isActive: $isActive
    ) {
      _id
      createdAt
      modifiedAt
      code
      discountType
      value
      validFrom
      validTo
      usageLimit
      usedCount
      isActive
    }
  }
`;

export const ONE_FIT_PROMO_CODE_UPDATE = gql`
  mutation OneFitPromoCodeUpdate(
    $_id: String!
    $code: String
    $discountType: OneFitPromoCodeDiscountType
    $value: Float
    $validFrom: Date
    $validTo: Date
    $usageLimit: Int
    $isActive: Boolean
  ) {
    oneFitPromoCodeUpdate(
      _id: $_id
      code: $code
      discountType: $discountType
      value: $value
      validFrom: $validFrom
      validTo: $validTo
      usageLimit: $usageLimit
      isActive: $isActive
    ) {
      _id
      modifiedAt
      code
      discountType
      value
      validFrom
      validTo
      usageLimit
      usedCount
      isActive
    }
  }
`;

export const ONE_FIT_PROMO_CODES_REMOVE = gql`
  mutation OneFitPromoCodesRemove($ids: [String]!) {
    oneFitPromoCodesRemove(ids: $ids)
  }
`;
