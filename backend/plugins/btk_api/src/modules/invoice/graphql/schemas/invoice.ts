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
  btkGetInvoice(_id: String!): Invoice
  btkGetInvoices(itemId:String!): [Invoice]
`;

export const mutations = `
  btkPayInvoice(_id: String!, paidDate: Date): String
`;
