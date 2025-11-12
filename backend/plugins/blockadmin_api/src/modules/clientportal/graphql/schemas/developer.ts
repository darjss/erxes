import { GQL_OFFSET_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type CpBlockAdminDeveloper {
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
    socialLinks: BlockAdminDeveloperSocialLink
    isVerified: Boolean
  }
`;

const queryParams = `
  isVerified: Boolean
  searchValue: String
  location: JSON
  
  ${GQL_OFFSET_PARAM_DEFS}
`;

export const queries = `
  cpBlockAdminDevelopers(${queryParams}): [CpBlockAdminDeveloper]
  cpBlockAdminDeveloperInfo(_id: String): CpBlockAdminDeveloper
`;
