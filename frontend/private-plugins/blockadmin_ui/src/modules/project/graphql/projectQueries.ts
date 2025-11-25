import { gql } from '@apollo/client';

export const BLOCK_GET_PROJECTS = gql`
  query BlockAdminGetProjects {
    blockAdminGetProjects {
      _id
      name
      isPublished
      shortDescription
      description
      location {
        address
        city
        district
        lat
        lng
        parcelId
      }
      verificationStatus
      status
      logo
      coverImage
      images
      bankPartners
      mainPrice
      prices {
        currency
        price
        priceType
      }
      types
      projectAmenities {
        amenities
        category
      }

      startDate
      endDate

      counts
      priceRanges
      progress
      metrics
      targets
      contacts
      links
    }
  }
`;

export const BLOCK_GET_PROJECT_DETAIL = gql`
  query BlockAdminGetProject($id: String!) {
    blockAdminGetProject(_id: $id) {
      _id
      name
      isPublished
      shortDescription
      description
      location {
        address
        city
        district
        lat
        lng
        parcelId
      }
      verificationStatus
      status
      logo
      coverImage
      images
      bankPartners
      mainPrice
      prices {
        currency
        price
        priceType
      }
      types
      projectAmenities {
        amenities
        category
      }

      startDate
      endDate

      counts
      priceRanges
      progress
      metrics
      targets
      contacts
      links
      schedules
      developerId
    }
  }
`;

export const BLOCK_GET_PROJECT_LIST = gql`
  query BlockAdminGetProjects {
    blockAdminGetProjects {
      _id
      name
    }
  }
`;

export const BLOCK_GET_PROJECT_MEMBERS = gql`
  query BlockGetProjectMembers($project: String!) {
    blockGetProjectMembers(project: $project) {
      _id
      memberId
      project
      role
    }
  }
`;
