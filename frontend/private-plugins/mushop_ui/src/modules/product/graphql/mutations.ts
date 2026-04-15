import { gql } from '@apollo/client';

export const MUSHOP_UPDATE_PRODUCT_STATUS = gql`
  mutation MushopUpdateProductStatus($_id: String!, $status: String!) {
    mushopUpdateProductStatus(_id: $_id, status: $status) {
      _id
      status
    }
  }
`;

export const MUSHOP_ASSIGN_PRODUCT_CATEGORY = gql`
  mutation MushopAssignProductCategory($_id: String!, $mushopCategoryId: String) {
    mushopAssignProductCategory(_id: $_id, mushopCategoryId: $mushopCategoryId) {
      _id
      mushopCategoryId
      mushopCategory {
        _id
        name
        code
      }
    }
  }
`;
