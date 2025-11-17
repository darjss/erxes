import { gql } from '@apollo/client';

export const CREATE_PAYMENT_PLAN = gql`
  mutation BtkCreateProjectPaymentPlan($input: BtkProjectPaymentPlanInput!) {
    btkCreateProjectPaymentPlan(input: $input) {
      _id
    }
  }
`;

export const UPDATE_PAYMENT_PLAN = gql`
  mutation BtkUpdateProjectPaymentPlan(
    $id: String!
    $input: BtkProjectPaymentPlanInput!
  ) {
    btkUpdateProjectPaymentPlan(_id: $id, input: $input) {
      _id
    }
  }
`;

export const REMOVE_PAYMENT_PLAN = gql`
  mutation BtkRemoveProjectPaymentPlan($id: String!) {
    btkRemoveProjectPaymentPlan(_id: $id)
  }
`;
