export const types = `
  type Invoice {
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
  blockGetInvoice(_id: String!): Invoice
  blockGetInvoices(itemId:String!): [Invoice]
`;
