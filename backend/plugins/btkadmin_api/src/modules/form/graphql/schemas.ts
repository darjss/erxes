export const types = `
  type BtkSubmission {
    _id: String!
    email: String!
    name: String!
    phone: String!
    answer1: String
    answer2: String
    answer3: String
    answer4: String
    answer5: String
    answer6: String
    submittedAt: Date
    createdAt: Date
  }

  input BtkSubmissionInput {
    email: String
    name: String
    phone: String
    answer1: String
    answer2: String
    answer3: String
    answer4: String
    answer5: String
    answer6: String
  }

  input BtkSubmissionsQueryInput {
    page: Int
    perPage: Int
    search: String
    sortField: String
    sortDirection: Int # 1 = ASC, -1 = DESC
  }

  type BtkSubmissionsResponse {
    list: [BtkSubmission!]!
    totalCount: Int!
  }
`;
export const mutations = `
    btkAdminSubmitForm(input: BtkSubmissionInput!): BtkSubmission
`;

export const queries = `
    btkAdminGetSubmissions(query: BtkSubmissionsQueryInput): BtkSubmissionsResponse
`;
