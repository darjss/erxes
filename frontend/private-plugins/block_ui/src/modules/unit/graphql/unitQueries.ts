import { gql } from '@apollo/client';

export const BLOCK_GET_UNITS = gql`
  query BlockGetUnits($zoning: String!) {
    blockGetUnits(zoning: $zoning) {
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
  query BlockGetUnit($id: String!) {
    blockGetUnit(_id: $id) {
      _id
      building
      number
      size
      type
      updatedAt
      zoning
      mainPrice
      currency
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
  query BlockGetAttachments($itemType: String!, $itemId: String!) {
    blockGetAttachments(itemType: $itemType, itemId: $itemId) {
      _id
      attachment
    }
  }
`;
