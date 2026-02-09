import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type OneFitCity {
    _id: String
    name: OneFitMultilingualString
    code: String
    isActive: Boolean
    createdAt: Date
    modifiedAt: Date
  }

  type OneFitDistrict {
    _id: String
    cityId: String
    name: OneFitMultilingualString
    code: String
    isActive: Boolean
    createdAt: Date
    modifiedAt: Date
  }

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
    instanceId: String
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
  hasScheduleFutureOrNow: Boolean,
  near: OneFitCoordinatesInput,
  maxDistance: Float,
`;

export const queries = `
  oneFitProviders(${queryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitProviderListResponse
  oneFitProvidersCount(${queryParams}): Int
  oneFitProvider(_id: String): OneFitProvider
  oneFitCities(isActive: Boolean): [OneFitCity]
  oneFitDistricts(cityId: String, isActive: Boolean): [OneFitDistrict]
  oneFitCitiesAdmin(isActive: Boolean, searchValue: String): [OneFitCity]
  oneFitDistrictsAdmin(cityId: String, isActive: Boolean, searchValue: String): [OneFitDistrict]
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
  oneFitCityCreate(
    name: OneFitMultilingualStringInput!
    code: String
    isActive: Boolean
  ): OneFitCity
  oneFitCityUpdate(
    _id: String!
    name: OneFitMultilingualStringInput
    code: String
    isActive: Boolean
  ): OneFitCity
  oneFitCityRemove(_id: String!): JSON
  oneFitDistrictCreate(
    cityId: String!
    name: OneFitMultilingualStringInput!
    code: String
    isActive: Boolean
  ): OneFitDistrict
  oneFitDistrictUpdate(
    _id: String!
    cityId: String
    name: OneFitMultilingualStringInput
    code: String
    isActive: Boolean
  ): OneFitDistrict
  oneFitDistrictRemove(_id: String!): JSON
`;
