import { gql } from '@apollo/client';

export const BLOCK_GET_BUILDING_LIST = gql`
  query BlockGetBuildings($project: String!) {
    blockGetBuildings(project: $project) {
      _id
      description
      name
      type
      coverImage
      project
    }
  }
`;

export const BLOCK_GET_BUILDING_ZONINGS = gql`
  query BlockGetBuildingZonings($building: String!) {
    blockGetBuildingZonings(building: $building) {
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
