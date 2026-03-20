export const types = `
  type BlockInvoice {
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
  blockGetInvoice(_id: String!): BlockInvoice
  blockGetInvoices(itemId:String!): [BlockInvoice]
`;

export const mutations = `
  blockPayInvoice(_id: String!, paidDate: Date): String
`;
