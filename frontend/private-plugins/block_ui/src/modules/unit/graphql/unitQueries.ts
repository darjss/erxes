import { gql } from '@apollo/client';

export const BLOCK_GET_UNITS = gql`
  query BlockGetUnits($zoning: String, $zonings: [String]) {
    blockGetUnits(zoning: $zoning, zonings: $zonings) {
      _id
      number
      type
      unitType {
        _id
        name
        size
      }
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
      unitType {
        _id
        name
        size
      }
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
      subTypes
      featureTypes
      areaType
      tenureTypes
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
      coverImage
      images
      planImages
      createdAt
      updatedAt
    }
  }
`;

export const BLOCK_GET_UNIT_TYPE = gql`
  query BlockGetUnitType($id: String!) {
    blockGetUnitType(_id: $id) {
      _id
      name
      description
      size
      type
      subTypes
      featureTypes
      areaType
      tenureTypes
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
      coverImage
      images
      planImages
      createdAt
      updatedAt
    }
  }
`;
