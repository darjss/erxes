import { GQL_OFFSET_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `

type CpBtkAdminNews {
  _id: String
  name: String
  isPublished: Boolean
  location: btkAdminNewsLocation
  verificationStatus: btkAdminAdminNewsVerificationStatus
  images: [String]
  companyId: String
  title: String
  content: String
  status: btkAdminAdminNewsStatus
  coverImage: String
  logo: String
  newsAmenities: [btkAdminNewsAmenity]
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
  companyData: BtkAdminCompany
}

`;

const queryParams = `
  searchValue: String
  companyId: String
  location: BtkAdminNewsLocationInput
  priceMin: Int
  priceMax: Int

  ${GQL_OFFSET_PARAM_DEFS}
`;

export const queries = `
  cpBtkAdminNewsInfo(_id: String!): CpBtkAdminNews
  cpBtkAdminAllNews(${queryParams}): [CpBtkAdminNews]
`;
