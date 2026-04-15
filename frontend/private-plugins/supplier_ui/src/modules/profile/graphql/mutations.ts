import { gql } from '@apollo/client';
import { SUPPLIER_FRAGMENT } from './queries';

export const UPDATE_GET_SUPPLIER = gql`
  mutation UpdateSupplier($input: SupplierInput!) {
    updateSupplier(input: $input) {
      ...SupplierFields
    }
  }
  ${SUPPLIER_FRAGMENT}
`;
