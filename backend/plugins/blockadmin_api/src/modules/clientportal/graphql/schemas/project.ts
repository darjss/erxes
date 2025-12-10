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
    sizeRanges: JSON
    roomRanges: JSON
    developer: BlockAdminDeveloper

    tier: String
    isFeatured: Boolean
  }

  type CpBlockAdminProjectDistrict {
    district: String
    count: Int
    price: Float
  }
`;

const queryParams = `
  searchValue: String
  developerId: String
  district: String
  priceMin: Int
  priceMax: Int
  type: String
  isFeatured: Boolean

  ${GQL_OFFSET_PARAM_DEFS}
`;

export const queries = `
  cpBlockAdminProject(_id: String!): CpBlockAdminProject
  cpBlockAdminProjects(${queryParams}): [CpBlockAdminProject]
  cpBlockAdminProjectsDistrict: [CpBlockAdminProjectDistrict]
`;
