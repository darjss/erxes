import { gql } from '@apollo/client';
import { INVENTORY_ITEM_FIELDS } from './queries';

export const CREATE_INVENTORY_ITEM = gql`
  mutation InventoryItemCreate($supplierId: String!, $input: InventoryItemInput!) {
    inventoryItemCreate(supplierId: $supplierId, input: $input) {
      ...InventoryItemFields
    }
  }
  ${INVENTORY_ITEM_FIELDS}
`;

export const UPDATE_INVENTORY_ITEM = gql`
  mutation InventoryItemUpdate($_id: String!, $supplierId: String!, $input: InventoryItemUpdateInput!) {
    inventoryItemUpdate(_id: $_id, supplierId: $supplierId, input: $input) {
      ...InventoryItemFields
    }
  }
  ${INVENTORY_ITEM_FIELDS}
`;


export const ADJUST_INVENTORY_QUANTITY = gql`
  mutation InventoryItemAdjustQuantity($_id: String!, $supplierId: String!, $delta: Float!) {
    inventoryItemAdjustQuantity(_id: $_id, supplierId: $supplierId, delta: $delta) {
      ...InventoryItemFields
    }
  }
  ${INVENTORY_ITEM_FIELDS}
`;

export const REMOVE_INVENTORY_ITEM = gql`
  mutation InventoryItemRemove($_id: String!, $supplierId: String!) {
    inventoryItemRemove(_id: $_id, supplierId: $supplierId)
  }
`;
