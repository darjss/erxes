export const types = `
  type InventoryItem {
    _id: String!
    supplierId: String!
    productId: String!
    barcode: String
    quantity: Float!
    safeRemainder: Float
    status: String
    notes: String
    isBelowSafeRemainder: Boolean
    createdAt: Date
    updatedAt: Date
  }

  type InventoryListResponse {
    list: [InventoryItem]
    totalCount: Int
  }

  input InventoryItemInput {
    productId: String!
    barcode: String
    quantity: Float
    safeRemainder: Float
    status: String
    notes: String
  }

  input InventoryItemUpdateInput {
    barcode: String
    quantity: Float
    safeRemainder: Float
    status: String
    notes: String
  }
`;

export const queries = `
  inventoryItem(_id: String!): InventoryItem
  inventoryItems(
    supplierId: String
    status: String
    isBelowSafeRemainder: Boolean
  ): InventoryListResponse
  safeRemainderItems(supplierId: String!): [InventoryItem]
`;

export const mutations = `
  inventoryItemCreate(supplierId: String!, input: InventoryItemInput!): InventoryItem
  inventoryItemUpdate(_id: String!, supplierId: String!, input: InventoryItemUpdateInput!): InventoryItem
  inventoryItemAdjustQuantity(_id: String!, supplierId: String!, delta: Float!): InventoryItem
  inventoryItemRemove(_id: String!, supplierId: String!): JSON
`;
