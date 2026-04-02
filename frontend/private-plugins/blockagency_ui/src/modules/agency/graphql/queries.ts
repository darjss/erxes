import { gql } from '@apollo/client';

export const GET_AGENCY_INFO = gql`
  query GetAgencyInfo {
    getAgencyInfo {
      _id
      name
      brandName
      type
      description
      brief
      logo
      coverImage
      documents
      website
      emails
      primaryEmail
      phones
      primaryPhone
      socialLinks
      dateFounded
      operationArea {
        city
        district
      }
      fieldsOfExpertise {
        propertyTypes
        services
        clientTypes
      }
      verificationStatus
    }
  }
`;
