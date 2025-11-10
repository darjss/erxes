import { gql } from '@apollo/client';

export const BLOCK_GET_DEVELOPER_INFO = gql`
  query GetDeveloperInfo {
    getDeveloperInfo {
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
