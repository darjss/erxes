import { gql } from '@apollo/client';

export const MUSHOP_PRODUCT_SPECIFICATION = gql`
  query MushopProductSpecification($productId: String!) {
    mushopProductSpecification(productId: $productId) {
      _id
      productId
      moq
      cnyCost
      profitPercent
      prepaymentPercent
    }
  }
`;

export const MUSHOP_PRODUCT_SPECIFICATION_SAVE = gql`
  mutation MushopProductSpecificationSave(
    $productId: String!
    $input: MushopProductSpecificationInput!
  ) {
    mushopProductSpecificationSave(productId: $productId, input: $input) {
      _id
      productId
      moq
      cnyCost
      profitPercent
      prepaymentPercent
    }
  }
`;
