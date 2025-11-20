import { gql } from '@apollo/client';

const BLOCK_ADMIN_GET_DEVELOPERS = gql`
  query GetBlockAdminDevelopers(
    $verificationStatus: String
    $searchValue: String
    $limit: Int
    $cursor: String
    $cursorMode: CURSOR_MODE
    $orderBy: JSON
    $direction: CURSOR_DIRECTION
  ) {
    getBlockAdminDevelopers(
      verificationStatus: $verificationStatus
      searchValue: $searchValue
      limit: $limit
      cursor: $cursor
      cursorMode: $cursorMode
      orderBy: $orderBy
      direction: $direction
    ) {
      list {
        _id
        name
        description
        about
        logo
        website
        registrationNumber
        address {
          location {
            type
            coordinates
          }
          address {
            countryCode
            country
            postCode
            city
            city_district
            suburb
            road
            street
            building
            number
            other
          }
          short
        }
        dateFounded
        primaryEmail
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
        verificationStatus
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export { BLOCK_ADMIN_GET_DEVELOPERS };
