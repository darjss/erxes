export const types = `
  type OneFitActivityCategory {
    _id: String
    createdAt: Date
    modifiedAt: Date
    name: OneFitMultilingualString
    description: OneFitMultilingualStringOptional
    parentId: String
    isActive: Boolean
    image: String
    icon: String
  }
`;

const queryParams = `
  searchValue: String,
  name: String,
  parentId: String,
  isActive: Boolean,
`;

export const queries = `
  oneFitActivityCategories(${queryParams}): [OneFitActivityCategory]
  oneFitActivityCategoriesCount(${queryParams}): Int
  oneFitActivityCategory(_id: String): OneFitActivityCategory
`;

const mutationParams = `
  name: OneFitMultilingualStringInput!
  description: OneFitMultilingualStringOptionalInput
  parentId: String
  isActive: Boolean
  image: String
  icon: String
`;

export const mutations = `
  oneFitActivityCategoryCreate(${mutationParams}): OneFitActivityCategory
  oneFitActivityCategoryUpdate(_id: String!, ${mutationParams}): OneFitActivityCategory
  oneFitActivityCategoriesRemove(ids: [String]!): JSON
`;
