import { GQL_OFFSET_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type CpBtkAdminNews {
    _id: String
    name: String
    isPublished: Boolean
    location: BtkAdminNewsLocation
    verificationStatus: BtkAdminNewsVerificationStatus
    status: BtkAdminNewsStatus
    coverImage: String
    logo: String
    mainPrice: Int
    prices: [BtkAdminNewsPrice]
    newsAmenities: [BtkAdminNewsAmenity]
    bankPartners: [String]

    startDate: Date
    endDate: Date
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
  cpBtkAdminNews(_id: String!): CpBtkAdminNews
  cpBtkAdminAllNews(${queryParams}): [CpBtkAdminNews]
`;
