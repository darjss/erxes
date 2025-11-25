import { gql } from '@apollo/client';

export const BLOCK_GET_UNITS = gql`
  query BlockAdminGetUnits($zoning: String!) {
    blockAdminGetUnits(zoning: $zoning) {
      _id
      number
      size
      type
      tenureType
      status
    }
  }
`;

export const BLOCK_GET_UNIT = gql`
  query BlockAdminGetUnit($id: String!) {
    blockAdminGetUnit(_id: $id) {
      _id
      building
      number
      size
      type
      updatedAt
      zoning
      mainPrice
      status
      prices {
        currency
        price
        priceType
      }
      tenureType
    }
  }
`;

export const BLOCK_UNIT_ATTACHMENTS = gql`
  query BlockAdminGetAttachments($itemType: String!, $itemId: String!) {
    blockAdminGetAttachments(itemType: $itemType, itemId: $itemId) {
      _id
      attachment
    }
  }
`;
