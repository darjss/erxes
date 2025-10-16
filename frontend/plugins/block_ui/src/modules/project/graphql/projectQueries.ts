import { gql } from '@apollo/client';

export const BLOCK_GET_PROJECTS = gql`
  query BlockGetProjects {
    blockGetProjects {
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
  query BlockGetProject($id: String!) {
    blockGetProject(_id: $id) {
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
      status
      coverImage
      bankPartners
      mainPrice
      prices {
        currency
        price
        priceType
      }
    }
  }
`;

export const BLOCK_GET_PROJECT_LIST = gql`
  query BlockGetProjectsList {
    blockGetProjects {
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
