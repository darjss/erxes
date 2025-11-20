import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type BtkAdminCompany {
    _id: String
    name: String
    description: String
    about: String
    logo: String
    website: String
    address: JSON
    dateFounded: Date
    email: String
    primaryPhone: String
    coverImage: String
    phones: [String]
    socialLinks: BtkAdminCompanySocialLink
    isVerified: Boolean
  }

  type BtkAdminCompanyListResponse {
    list: [BtkAdminCompany]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const queryParams = `
  isVerified: Boolean
  searchValue: String

  ${GQL_CURSOR_PARAM_DEFS}
`;

export const queries = `
  getBtkAdminCompanies(${queryParams}): BtkAdminCompanyListResponse
  getBtkAdminCompanyInfo(_id: String): BtkAdminCompany
`;
