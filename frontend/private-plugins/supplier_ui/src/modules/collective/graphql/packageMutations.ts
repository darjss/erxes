import { gql } from '@apollo/client';
import { COLLECTIVE_PACKAGE_FRAGMENT } from './packageQueries';

export const ADD_COLLECTIVE_PACKAGE = gql`
  mutation CollectivePackageAdd($input: CollectivePackageInput!) {
    collectivePackageAdd(input: $input) {
      ...CollectivePackageFields
    }
  }
  ${COLLECTIVE_PACKAGE_FRAGMENT}
`;

export const EDIT_COLLECTIVE_PACKAGE_STATUS = gql`
  mutation CollectivePackageEditStatus($_id: String!, $status: String!) {
    collectivePackageEditStatus(_id: $_id, status: $status) {
      ...CollectivePackageFields
    }
  }
  ${COLLECTIVE_PACKAGE_FRAGMENT}
`;
