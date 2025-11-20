import { gql } from '@apollo/client';

export const BTK_GET_Company_INFO = gql`
  query GetCompanyInfo {
    getCompanyInfo {
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
