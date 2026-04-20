import { gql } from '@apollo/client';

const SUBMISSION_FIELDS = gql`
  fragment SubmissionFields on Submission {
    _id
    productId
    supplierId
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
  mutation SubmitProductsBulk($items: [SubmitProductInput!]!) {
    submitProductsBulk(items: $items) {
      ...SubmissionFields
    }
  }
  ${SUBMISSION_FIELDS}
`;

export const RESUBMIT_PRODUCT_TO_PLATFORM = gql`
  mutation ResubmitProductToPlatform(
    $productId: String!
    $offering: SubmitOfferingInput
  ) {
    resubmitProductToPlatform(productId: $productId offering: $offering) {
      ...SubmissionFields
    }
  }
  ${SUBMISSION_FIELDS}
`;
