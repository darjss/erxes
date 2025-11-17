import { gql } from '@apollo/client';

export const BTK_GET_PROJECTS = gql`
  query BtkGetProjects {
    btkGetProjects {
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

export const BTK_GET_PROJECT_DETAIL = gql`
  query BtkGetProject($id: String!) {
    btkGetProject(_id: $id) {
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
      companyId
      title
      content
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
    }
  }
`;

export const BTK_GET_PROJECT_LIST = gql`
  query BtkGetProjectsList {
    btkGetProjects {
      _id
      name
    }
  }
`;

export const BTK_GET_PROJECT_MEMBERS = gql`
  query BtkGetProjectMembers($project: String!) {
    btkGetProjectMembers(project: $project) {
      _id
      memberId
      project
      role
    }
  }
`;
