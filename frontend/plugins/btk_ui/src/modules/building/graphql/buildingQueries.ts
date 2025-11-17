import { gql } from '@apollo/client';

export const BTK_GET_BUILDING_LIST = gql`
  query BtkGetBuildings($project: String!) {
    btkGetBuildings(project: $project) {
      _id
      description
      name
      type
      coverImage
      project
    }
  }
`;

export const BTK_GET_BUILDING_ZONINGS = gql`
  query BtkGetBuildingZonings($building: String!) {
    btkGetBuildingZonings(building: $building) {
      _id
      building
      floor
      tenureType
      unitsCount
      usageType
      size
    }
  }
`;
