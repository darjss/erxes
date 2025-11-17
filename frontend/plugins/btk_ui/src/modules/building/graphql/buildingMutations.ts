import { gql } from '@apollo/client';

export const BTK_CREATE_BUILDING = gql`
  mutation BtkCreateBuilding($input: BtkBuildingInput!) {
    btkCreateBuilding(input: $input) {
      _id
    }
  }
`;

export const BTK_UPDATE_BUILDING = gql`
  mutation BtkUpdateBuilding($id: String!, $input: BtkBuildingInput!) {
    btkUpdateBuilding(_id: $id, input: $input) {
      _id
    }
  }
`;

export const BTK_CREATE_BUILDING_ZONING = gql`
  mutation BtkCreateBuildingZoning($input: BtkBuildingZoningInput!) {
    btkCreateBuildingZoning(input: $input) {
      _id
    }
  }
`;

export const BTK_UPDATE_BUILDING_ZONING = gql`
  mutation BtkUpdateBuildingZoning(
    $id: String!
    $input: BtkBuildingZoningInput!
  ) {
    btkUpdateBuildingZoning(_id: $id, input: $input) {
      _id
    }
  }
`;

export const BTK_REMOVE_BUILDINGS = gql`
  mutation BtkRemoveBuildings($ids: [String!]!) {
    btkRemoveBuildings(ids: $ids)
  }
`;

export const BTK_DELETE_BUILDING_ZONING = gql`
  mutation BtkDeleteBuildingZoning($id: String!) {
    btkDeleteBuildingZoning(_id: $id) {
      _id
    }
  }
`;
