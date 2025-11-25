import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type BlockAdminProject {
    _id: String
    name: String
    isPublished: Boolean
    shortDescription: String
    description: String
    location: BlockAdminProjectLocation
    verificationStatus: BlockAdminDeveloperVerificationStatus
    status: BlockAdminProjectStatus
    logo: String
    coverImage: String
    images: [String]
    mainPrice: Int
    prices: [BlockAdminProjectPrice]
    projectAmenities: [BlockAdminProjectAmenity]
    bankPartners: [String]
    types: [String]

    startDate: Date
    endDate: Date

    counts: JSON
    priceRanges: JSON
    metrics: JSON
    targets: JSON
    contacts: JSON
    links: JSON
    progress: Float
    schedules: JSON

    developerId: String
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
