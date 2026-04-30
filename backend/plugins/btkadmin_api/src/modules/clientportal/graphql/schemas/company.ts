import { GQL_OFFSET_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `

  type CpBtkAdminCompany {
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
    verificationStatus: String
  }
`;

const queryParams = `
  verificationStatus: String
  searchValue: String
  location: JSON

  ${GQL_OFFSET_PARAM_DEFS}
`;

export const queries = `
  cpBtkAdminCompanies(${queryParams}): [CpBtkAdminCompany]
  cpBtkAdminCompanyInfo(_id: String): CpBtkAdminCompany
`;
