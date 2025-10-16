import { gql } from '@apollo/client';

export const BLOCK_GET_DEVELOPER_INFO = gql`
  query GetDeveloperInfo {
    getDeveloperInfo {
      _id
      name
      description
      logo
      website
      address
      dateFounded
      email
      phone
    }
  }
`;
