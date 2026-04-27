import { gql } from '@apollo/client';

const SUBMISSION_FIELDS = gql`
  fragment SubmissionFields on SupplierSubmission {
    _id
    productId
    status
    note
    offering {
      price
      stock
      minBuyCount
      maxBuyCount
      groupBuyMinCount
      groupBuyDiscount
      warrantyDuration
    }
    submittedAt
    decidedAt
  }
`;

export const SUBMIT_PRODUCTS_BULK = gql`
  mutation SupplierSubmitProductsBulk($platform: String!, $items: [SubmitProductInput!]!) {
    supplierSubmitProductsBulk(platform: $platform, items: $items) {
      ...SubmissionFields
    }
  }
  ${SUBMISSION_FIELDS}
`;

export const RESUBMIT_PRODUCT_TO_PLATFORM = gql`
  mutation SupplierResubmitProduct(
    $platform: String!
    $productId: String!
    $offering: SubmitOfferingInput
  ) {
    supplierResubmitProduct(platform: $platform, productId: $productId, offering: $offering) {
      ...SubmissionFields
    }
  }
  ${SUBMISSION_FIELDS}
`;
