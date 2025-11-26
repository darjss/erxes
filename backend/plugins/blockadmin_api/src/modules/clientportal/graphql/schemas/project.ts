import { GQL_OFFSET_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type CpBlockAdminProject {
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
  }
`;

const queryParams = `
  searchValue: String
  developerId: String
  location: BlockAdminProjectLocationInput
  priceMin: Int
  priceMax: Int

  ${GQL_OFFSET_PARAM_DEFS}
`;

export const queries = `
  cpBlockAdminProject(_id: String!): CpBlockAdminProject
  cpBlockAdminProjects(${queryParams}): [CpBlockAdminProject]
`;
