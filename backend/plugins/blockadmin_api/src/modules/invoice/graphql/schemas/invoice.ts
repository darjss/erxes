export const types = `
  type BlockAdminInvoice {
    _id: String
    amount: Float
    date: Date
    lateDays: Int
    status: String
    number: Int
    itemId: String
    itemType: String
    paidDate: Date
    customDate: String
    description: String
  }
`;

export const queries = `
  blockAdminGetInvoice(_id: String!): BlockAdminInvoice
  blockAdminGetInvoices(itemId:String!): [BlockAdminInvoice]
`;
