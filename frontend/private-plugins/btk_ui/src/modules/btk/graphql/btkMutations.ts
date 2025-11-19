import { gql } from '@apollo/client';

export const UPDATE_Company_INFO = gql`
  mutation UpdateCompanyInfo($input: CompanyInput) {
    updateCompanyInfo(input: $input) {
      _id
    }
  }
`;
