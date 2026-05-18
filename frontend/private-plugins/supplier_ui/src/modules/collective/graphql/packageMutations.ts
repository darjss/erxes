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
