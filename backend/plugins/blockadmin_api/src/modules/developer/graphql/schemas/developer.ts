import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type BlockAdminDeveloperSocialLink {
    facebook: String
    twitter: String
    instagram: String
    linkedin: String
    youtube: String
    website: String
  }

  type BlockAdminDeveloper {
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

  type BlockAdminDeveloperListResponse {
    list: [BlockAdminDeveloper]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const queryParams = `
  isVerified: Boolean
  
  ${GQL_CURSOR_PARAM_DEFS}
`;

export const queries = `
  getBlockAdminDevelopers(${queryParams}): BlockAdminDeveloperListResponse
  getBlockAdminDeveloperInfo(_id: String): BlockAdminDeveloper
`;
