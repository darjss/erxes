import { gql } from '@apollo/client';

export const UPDATE_AGENCY = gql`
  mutation UpdateAgencyInfo($input: AgencyInput!) {
    updateAgencyInfo(input: $input) {
      _id
    }
  }
`;
