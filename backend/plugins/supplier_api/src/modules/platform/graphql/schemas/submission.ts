export const types = `
  type SubmissionOffering {
    price: Float
    stock: Float
    minBuyCount: Float
    maxBuyCount: Float
    groupBuyMinCount: Float
    groupBuyDiscount: Float
    warrantyDuration: Float
  }

  type Submission {
    _id: String!
    platform: String!
    productId: String!
    status: String!
    note: String
    offering: SubmissionOffering
    submittedAt: Date
    decidedAt: Date
    createdAt: Date
    updatedAt: Date
  }

  type SubmissionListResponse {
    list: [Submission]
    totalCount: Int
    pageInfo: PageInfo
  }
`;

export const queries = `
  submissions(platform: String, status: String, limit: Int, cursor: String, direction: String): SubmissionListResponse
`;

export const mutations = `
  submitProductsBulk(platform: String!, items: [SubmitProductInput!]!): [Submission]
  resubmitProductToPlatform(platform: String!, productId: String!, offering: SubmitOfferingInput): Submission
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
