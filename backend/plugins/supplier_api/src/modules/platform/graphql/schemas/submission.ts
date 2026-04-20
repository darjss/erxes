export const types = `
  type SupplierSubmissionOffering {
    price: Float
    stock: Float
    minBuyCount: Float
    maxBuyCount: Float
    groupBuyMinCount: Float
    groupBuyDiscount: Float
    warrantyDuration: Float
  }

  type SupplierSubmission {
    _id: String!
    platform: String!
    productId: String!
    status: String!
    note: String
    offering: SupplierSubmissionOffering
    submittedAt: Date
    decidedAt: Date
    createdAt: Date
    updatedAt: Date
  }

  type SupplierSubmissionListResponse {
    list: [SupplierSubmission]
    totalCount: Int
    pageInfo: PageInfo
  }
`;

export const queries = `
  supplierSubmissions(platform: String, status: String, limit: Int, cursor: String, direction: String): SupplierSubmissionListResponse
`;

export const mutations = `
  submitProductsBulk(platform: String!, items: [SubmitProductInput!]!): [SupplierSubmission]
  resubmitProductToPlatform(platform: String!, productId: String!, offering: SubmitOfferingInput): SupplierSubmission
`;

export const inputTypes = `
  input SubmitOfferingInput {
    price: Float
    stock: Float
    minBuyCount: Float
    maxBuyCount: Float
    groupBuyMinCount: Float
    groupBuyDiscount: Float
    warrantyDuration: Float
  }

  input SubmitProductInput {
    productId: String!
    offering: SubmitOfferingInput
  }
`;
