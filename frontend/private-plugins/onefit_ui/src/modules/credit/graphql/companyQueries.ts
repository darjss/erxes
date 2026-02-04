import { gql } from '@apollo/client';
import {
  GQL_CURSOR_PARAM_DEFS,
  GQL_CURSOR_PARAMS,
  GQL_PAGE_INFO,
} from 'erxes-ui';

export const GET_COMPANIES_LIST = gql`
  query GetCompaniesList($searchValue: String ${GQL_CURSOR_PARAM_DEFS}) {
    companies(searchValue: $searchValue ${GQL_CURSOR_PARAMS}) {
      list {
        _id
        primaryName
      }
      ${GQL_PAGE_INFO}
    }
  }
`;

export const ONE_FIT_CUSTOMERS_BY_COMPANY_ID = gql`
  query OneFitCustomersByCompanyId($companyId: String!) {
    oneFitCustomersByCompanyId(companyId: $companyId) {
      _id
      primaryPhone
      primaryEmail
    }
  }
`;
