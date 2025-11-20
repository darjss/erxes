import { gql } from '@apollo/client';

export const BLOCK_GET_PROJECTS = gql`
  query BlockAdminGetProjects {
    blockAdminGetProjects {
      _id
      name
      coverImage
      location {
        address
        city
        district
        lat
        lng
        parcelId
      }
    }
  }
`;

export const BLOCK_GET_PROJECT_DETAIL = gql`
  query BlockAdminGetProject($id: String!) {
    blockAdminGetProject(_id: $id) {
      _id
      name
      isPublished
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
      coverImage
      bankPartners
      mainPrice
      prices {
        currency
        price
        priceType
      }
      projectAmenities {
        amenities
        category
      }
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
