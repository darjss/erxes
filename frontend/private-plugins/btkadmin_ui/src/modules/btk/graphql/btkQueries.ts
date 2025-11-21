import { gql } from '@apollo/client';

export const BTK_GET_COMPANY_INFO = gql`
  query BtkAdminCompanyInfo($_id: String) {
    btkAdminCompanyInfo(_id: $id) {
      _id
      name
      description
      about
      logo
      website
      address
      dateFounded
      email
      primaryPhone
      coverImage
      phones
      socialLinks {
        facebook
        twitter
        instagram
        linkedin
        youtube
        website
      }
      isVerified
    }
  }
`;

export const BTK_GET_COMPANIES = gql`
  query BtkAdminCompanies {
    btkAdminCompanies {
      _id
      name
      coverImage
    }
  }
`;

export const BTK_GET_COMPANY_LIST = gql`
  query BtkAdminCompanies {
    btkAdminCompanies {
      _id
      name
    }
  }
`;
