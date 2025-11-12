import { GQL_OFFSET_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type CpBlockAdminProject {
    _id: String
    name: String
    isPublished: Boolean
    location: BlockAdminProjectLocation
    verificationStatus: BlockAdminProjectVerificationStatus
    status: BlockAdminProjectStatus
    coverImage: String
    mainPrice: Int
    prices: [BlockAdminProjectPrice]
    projectAmenities: [BlockAdminProjectAmenity]
    bankPartners: [String]

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

  ${GQL_OFFSET_PARAM_DEFS}
`;

export const queries = `
  cpBlockAdminProject(_id: String!): CpBlockAdminProject
  cpBlockAdminProjects(${queryParams}): [CpBlockAdminProject]
`;
