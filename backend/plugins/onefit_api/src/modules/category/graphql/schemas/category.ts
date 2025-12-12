import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type OneFitActivityCategory {
    _id: String
    createdAt: Date
    modifiedAt: Date
    name: OneFitMultilingualString
    description: OneFitMultilingualStringOptional
    parentId: String
    isActive: Boolean
  }

  type OneFitActivityCategoryListResponse {
    list: [OneFitActivityCategory]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const queryParams = `
  searchValue: String,
  name: String,
  parentId: String,
  isActive: Boolean,
`;

export const queries = `
  oneFitActivityCategories(${queryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitActivityCategoryListResponse
  oneFitActivityCategoriesCount(${queryParams}): Int
  oneFitActivityCategory(_id: String): OneFitActivityCategory
`;

const mutationParams = `
  name: OneFitMultilingualStringInput!
  description: OneFitMultilingualStringOptionalInput
  parentId: String
  isActive: Boolean
`;

export const mutations = `
  oneFitActivityCategoryCreate(${mutationParams}): OneFitActivityCategory
  oneFitActivityCategoryUpdate(_id: String!, ${mutationParams}): OneFitActivityCategory
  oneFitActivityCategoriesRemove(ids: [String]!): JSON
`;
