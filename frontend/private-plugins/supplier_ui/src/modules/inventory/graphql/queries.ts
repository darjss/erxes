import { gql } from '@apollo/client';

export const INVENTORY_ITEM_FIELDS = gql`
  fragment InventoryItemFields on InventoryItem {
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
`;

export const GET_INVENTORY_ITEMS = gql`
  query GetInventoryItems(
    $supplierId: String
    $status: String
    $isBelowSafeRemainder: Boolean
  ) {
    inventoryItems(
      supplierId: $supplierId
      status: $status
      isBelowSafeRemainder: $isBelowSafeRemainder
    ) {
      list {
        ...InventoryItemFields
      }
      totalCount
    }
  }
  ${INVENTORY_ITEM_FIELDS}
`;

export const GET_INVENTORY_ITEM = gql`
  query GetInventoryItem($_id: String!) {
    inventoryItem(_id: $_id) {
      ...InventoryItemFields
    }
  }
  ${INVENTORY_ITEM_FIELDS}
`;

export const GET_SAFE_REMAINDER_ITEMS = gql`
  query GetSafeRemainderItems($supplierId: String!) {
    safeRemainderItems(supplierId: $supplierId) {
      ...InventoryItemFields
    }
  }
  ${INVENTORY_ITEM_FIELDS}
`;
