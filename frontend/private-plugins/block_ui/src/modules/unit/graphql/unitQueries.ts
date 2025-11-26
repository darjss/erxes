import { gql } from '@apollo/client';

export const BLOCK_GET_UNITS = gql`
  query BlockGetUnits($zoning: String!) {
    blockGetUnits(zoning: $zoning) {
      _id
      number
      type
      status
    }
  }
`;

export const BLOCK_GET_UNIT = gql`
  query BlockGetUnit($id: String!) {
    blockGetUnit(_id: $id) {
      _id
      building
      number
      type
      updatedAt
      zoning
      status
    }
  }
`;

export const BLOCK_UNIT_ATTACHMENTS = gql`
  query BlockGetAttachments($itemType: String!, $itemId: String!) {
    blockGetAttachments(itemType: $itemType, itemId: $itemId) {
      _id
      attachment
    }
  }
`;

export const BLOCK_GET_UNIT_TYPES = gql`
  query BlockGetUnitTypes($project: String) {
    blockGetUnitTypes(project: $project) {
      _id
      name
      description
      size
      type
      tenureType
      content
      price
      prices {
        currency
        priceType
        price
      }
      status
      rooms
      roomsCount
      createdAt
      updatedAt
    }
  }
`;
