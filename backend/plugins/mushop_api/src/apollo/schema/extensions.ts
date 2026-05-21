export const TypeExtensions = `
  extend type User @key(fields: "_id") {
    _id: String @external
  }

  extend type Customer @key(fields: "_id") {
    _id: String @external
  }

  extend type Company @key(fields: "_id") {
    _id: String @external
  }

  union Owner = User | Customer | Company

  extend type CPUser @key(fields: "_id") {
    _id: String @external
    isSubscribed: Boolean
    subscription: MushopSubscription
  }

  extend type cpPoscProduct {
    supplier: MushopSupplier
    unitPrice: Float
  }
`;
