import { gql } from '@apollo/client';

export const GET_INVENTORY_ITEM_DETAIL = gql`
  query GetInventoryItemDetail($_id: String!) {
    inventoryItem(_id: $_id) {
      _id
      supplierId
      productId
      barcode
      quantity
      safeRemainder
      status
      notes
      isBelowSafeRemainder
      createdAt
      updatedAt
    }
  }
`;
