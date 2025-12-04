import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type BlockAdminDeveloper {
    _id: String
    name: String
    description: String
    about: String
    logo: String
    website: String
    registrationNumber: String
    address: BlockAdminDeveloperAddressInfo
    dateFounded: String
    primaryEmail: String
    primaryPhone: String
    coverImage: String
    phones: [String]
    socialLinks: BlockAdminDeveloperSocialLink
    verificationStatus: String
    projectsCount: Int
  }

  type BlockAdminDeveloperListResponse {
    list: [BlockAdminDeveloper]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const queryParams = `
  verificationStatus: String
  searchValue: String
  district: String
  city: String
  dateFilters: String
  
  ${GQL_CURSOR_PARAM_DEFS}
`;

export const queries = `
  getBlockAdminDevelopers(${queryParams}): BlockAdminDeveloperListResponse
  getBlockAdminDeveloperInfo(_id: String): BlockAdminDeveloper
`;

export const mutations = `
  updateBlockAdminDeveloperVerificationStatus(developerId: String, status: BlockAdminDeveloperVerificationStatusEnum): BlockAdminDeveloper
`;
