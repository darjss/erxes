import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  enum OneFitGenderRestriction {
    male
    female
    mixed
  }

  type OneFitMultilingualString {
    en: String!
    mn: String!
  }

  type OneFitMultilingualStringOptional {
    en: String
    mn: String
  }

  type OneFitActivityType {
    _id: String
    createdAt: Date
    modifiedAt: Date
    providerId: String
    provider: OneFitProvider
    name: OneFitMultilingualString
    description: OneFitMultilingualStringOptional
    creditCost: Float
    duration: Int
    genderRestriction: OneFitGenderRestriction
    categoryIds: [String]
    categories: [OneFitActivityCategory]
    isActive: Boolean
    cancellationDeadline: Int
    image: String
  }

  type OneFitActivityTypeListResponse {
    list: [OneFitActivityType]
    pageInfo: PageInfo
    totalCount: Int
  }

  type OneFitActivityTypeWithAvailability {
    _id: String
    createdAt: Date
    modifiedAt: Date
    providerId: String
    provider: OneFitProvider
    name: OneFitMultilingualString
    description: OneFitMultilingualStringOptional
    creditCost: Float
    duration: Int
    image: String
    genderRestriction: OneFitGenderRestriction
    categoryIds: [String]
    categories: [OneFitActivityCategory]
    isActive: Boolean
    cancellationDeadline: Int
    availability: OneFitDayAvailability
  }

  type OneFitActivityTypeWithAvailabilityListResponse {
    list: [OneFitActivityTypeWithAvailability]
    pageInfo: PageInfo
    totalCount: Int
  }
  input OneFitMultilingualStringInput {
    en: String!
    mn: String!
  }

  input OneFitMultilingualStringOptionalInput {
    en: String
    mn: String
  }
`;

const queryParams = `
  searchValue: String,
  providerId: String,
  categoryId: String,
  genderRestriction: OneFitGenderRestriction,
  isActive: Boolean,
  hasSchedule: Boolean,
`;

export const queries = `
  oneFitActivityTypes(${queryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitActivityTypeListResponse
  oneFitActivityTypesCount(${queryParams}): Int
  oneFitActivityType(_id: String): OneFitActivityType
  oneFitActivityTypesWithAvailability(date: Date!, categoryIds: [String], providerId: String, isActive: Boolean, hasSchedule: Boolean, isFull: Boolean, ${GQL_CURSOR_PARAM_DEFS}): OneFitActivityTypeWithAvailabilityListResponse
`;

const mutationParams = `
  providerId: String!
  name: OneFitMultilingualStringInput!
  description: OneFitMultilingualStringOptionalInput
  creditCost: Float!
  duration: Int!
  genderRestriction: OneFitGenderRestriction!
  categoryIds: [String]!
  isActive: Boolean
  cancellationDeadline: Int
  image: String
`;

const updateParams = `
  name: OneFitMultilingualStringInput
  description: OneFitMultilingualStringOptionalInput
  creditCost: Float
  duration: Int
  genderRestriction: OneFitGenderRestriction
  categoryIds: [String]
  isActive: Boolean
  cancellationDeadline: Int
  image: String
`;

export const mutations = `
  oneFitActivityTypeCreate(${mutationParams}): OneFitActivityType
  oneFitActivityTypeUpdate(_id: String!, ${updateParams}): OneFitActivityType
  oneFitActivityTypesRemove(ids: [String]!): JSON
`;
