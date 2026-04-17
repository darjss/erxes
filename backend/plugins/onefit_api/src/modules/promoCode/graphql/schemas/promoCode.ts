import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  enum OneFitPromoCodeDiscountType {
    percent
    fixed
  }

  type OneFitPromoCode {
    _id: String
    createdAt: Date
    modifiedAt: Date
    code: String
    discountType: OneFitPromoCodeDiscountType
    value: Float
    isCompanyTag: Boolean
    validFrom: Date
    validTo: Date
    usageLimit: Int
    usedCount: Int
    isActive: Boolean
  }

  type OneFitPromoCodeListResponse {
    list: [OneFitPromoCode]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const queryParams = `
  code: String,
  isActive: Boolean,
  validNow: Boolean,
`;

export const queries = `
  oneFitPromoCodes(${queryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitPromoCodeListResponse
  oneFitPromoCodesCount(${queryParams}): Int
  oneFitPromoCode(_id: String): OneFitPromoCode
`;

const createInput = `
  code: String!
  discountType: OneFitPromoCodeDiscountType!
  value: Float!
  isCompanyTag: Boolean
  validFrom: Date
  validTo: Date
  usageLimit: Int
  isActive: Boolean
`;

const updateInput = `
  code: String
  discountType: OneFitPromoCodeDiscountType
  value: Float
  isCompanyTag: Boolean
  validFrom: Date
  validTo: Date
  usageLimit: Int
  isActive: Boolean
`;

export const mutations = `
  oneFitPromoCodeCreate(${createInput}): OneFitPromoCode
  oneFitPromoCodeUpdate(_id: String!, ${updateInput}): OneFitPromoCode
  oneFitPromoCodesRemove(ids: [String]!): JSON
`;
