import { gql } from '@apollo/client';

export const BTK_GET_UNITS = gql`
  query BtkGetUnits($zoning: String!) {
    btkGetUnits(zoning: $zoning) {
      _id
      number
      size
      type
      tenureType
      status
    }
  }
`;

export const BTK_GET_UNIT = gql`
  query BtkGetUnit($id: String!) {
    btkGetUnit(_id: $id) {
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

export const BTK_UNIT_ATTACHMENTS = gql`
  query BtkGetAttachments($itemType: String!, $itemId: String!) {
    btkGetAttachments(itemType: $itemType, itemId: $itemId) {
      _id
      attachment
    }
  }
`;
