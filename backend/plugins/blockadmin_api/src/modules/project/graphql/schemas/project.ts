import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type BlockAdminProject {
    _id: String
    name: String
    isPublished: Boolean
    location: BlockAdminProjectLocation
    verificationStatus: BlockAdminDeveloperVerificationStatus
    status: BlockAdminProjectStatus
    coverImage: String
    mainPrice: Int
    prices: [BlockAdminProjectPrice]
    projectAmenities: [BlockAdminProjectAmenity]
    bankPartners: [String]
    developerId: String

    startDate: Date
    endDate: Date
  }
`;

const queryParams = `
  searchValue: String
  developerId: String
  location: BlockAdminProjectLocationInput
  priceMin: Int
  priceMax: Int

  ${GQL_CURSOR_PARAM_DEFS}
`;

export const queries = `
  blockAdminGetProject(_id: String!): BlockAdminProject
  blockAdminGetProjects(${queryParams}): [BlockAdminProject]
`;
