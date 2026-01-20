import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type OneFitLocation {
    address: OneFitMultilingualString
    city: OneFitMultilingualString
    district: OneFitMultilingualStringOptional
    coordinates: OneFitCoordinates
  }

  type OneFitCoordinates {
    lat: Float
    lng: Float
  }

  type OneFitContactInfo {
    phone: String
    email: String
    website: String
  }

  type OneFitProvider {
    _id: String
    createdAt: Date
    modifiedAt: Date
    businessName: OneFitMultilingualString
    description: OneFitMultilingualStringOptional
    location: OneFitLocation
    contactInfo: OneFitContactInfo
    facilities: [String]
    categoryIds: [String]
    categories: [OneFitActivityCategory]
    status: String
    rejectionReason: String
    approvedAt: Date
    approvedBy: String
    rejectedBy: String
    isActive: Boolean
    icon: String
    coverImages: [String]
    distance: Float
  }

  type OneFitProviderListResponse {
    list: [OneFitProvider]
    pageInfo: PageInfo
    totalCount: Int
  }

  input OneFitCoordinatesInput {
    lat: Float
    lng: Float
  }

  input OneFitLocationInput {
    address: OneFitMultilingualStringInput!
    city: OneFitMultilingualStringInput!
    district: OneFitMultilingualStringOptionalInput
    coordinates: OneFitCoordinatesInput
  }

  input OneFitContactInfoInput {
    phone: String!
    email: String!
    website: String
  }
`;

const queryParams = `
  searchValue: String,
  status: String,
  categoryId: String,
  isActive: Boolean,
  near: OneFitCoordinatesInput,
  maxDistance: Float,
`;

export const queries = `
  oneFitProviders(${queryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitProviderListResponse
  oneFitProvidersCount(${queryParams}): Int
  oneFitProvider(_id: String): OneFitProvider
`;

const mutationParams = `
  businessName: OneFitMultilingualStringInput
  description: OneFitMultilingualStringOptionalInput
  location: OneFitLocationInput
  contactInfo: OneFitContactInfoInput
  facilities: [String]
  categoryIds: [String]!
  isActive: Boolean
  icon: String
  coverImages: [String]
`;

export const mutations = `
  oneFitProviderCreate(${mutationParams}): OneFitProvider
  oneFitProviderUpdate(_id: String!, ${mutationParams}): OneFitProvider
  oneFitProviderApprove(_id: String!, approvedBy: String!): OneFitProvider
  oneFitProviderReject(_id: String!, rejectionReason: String!, rejectedBy: String!): OneFitProvider
  oneFitProvidersRemove(ids: [String]!): JSON
`;
