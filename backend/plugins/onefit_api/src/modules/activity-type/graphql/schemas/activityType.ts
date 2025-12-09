import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  enum OneFitGenderRestriction {
    male
    female
    mixed
  }

  type OneFitActivityType {
    _id: String
    createdAt: Date
    modifiedAt: Date
    providerId: String
    provider: OneFitProvider
    name: String
    description: String
    creditCost: Float
    duration: Int
    genderRestriction: OneFitGenderRestriction
    categoryIds: [String]
    categories: [OneFitActivityCategory]
    isActive: Boolean
    cancellationDeadline: Int
  }

  type OneFitActivityTypeListResponse {
    list: [OneFitActivityType]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const queryParams = `
  searchValue: String,
  providerId: String,
  categoryId: String,
  genderRestriction: OneFitGenderRestriction,
  isActive: Boolean,
`;

export const queries = `
  oneFitActivityTypes(${queryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitActivityTypeListResponse
  oneFitActivityTypesCount(${queryParams}): Int
  oneFitActivityType(_id: String): OneFitActivityType
`;

const mutationParams = `
  providerId: String!
  name: String!
  description: String
  creditCost: Float!
  duration: Int!
  genderRestriction: OneFitGenderRestriction!
  categoryIds: [String]!
  isActive: Boolean
  cancellationDeadline: Int
`;

const updateParams = `
  name: String
  description: String
  creditCost: Float
  duration: Int
  genderRestriction: OneFitGenderRestriction
  categoryIds: [String]
  isActive: Boolean
  cancellationDeadline: Int
`;

export const mutations = `
  oneFitActivityTypeCreate(${mutationParams}): OneFitActivityType
  oneFitActivityTypeUpdate(_id: String!, ${updateParams}): OneFitActivityType
  oneFitActivityTypesRemove(ids: [String]!): JSON
`;
