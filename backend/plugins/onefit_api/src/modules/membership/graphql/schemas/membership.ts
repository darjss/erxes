export const types = `
  type OneFitMembershipPlan {
    _id: String
    createdAt: Date
    modifiedAt: Date
    name: String
    description: String
    creditAmount: Float
    duration: Int
    price: Float
    isActive: Boolean
  }

  type OneFitMembershipPlanListResponse {
    list: [OneFitMembershipPlan]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const planQueryParams = `
  searchValue: String,
  isActive: Boolean,
`;

const purchaseQueryParams = `
  userId: String,
  isExpired: Boolean,
  isInGracePeriod: Boolean,
`;

import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const queries = `
  oneFitMembershipPlans(${planQueryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitMembershipPlanListResponse
  oneFitMembershipPlansCount(${planQueryParams}): Int
  oneFitMembershipPlan(_id: String): OneFitMembershipPlan
  oneFitActiveMembershipPlans: [OneFitMembershipPlan]

`;

const planInput = `
  name: String!
  description: String
  creditAmount: Float!
  duration: Int!
  price: Float!
  isActive: Boolean
`;

const planUpdateInput = `
  name: String
  description: String
  creditAmount: Float
  duration: Int
  price: Float
  isActive: Boolean
`;

const purchaseInput = `
  userId: String!
  planId: String!
`;

export const mutations = `
  oneFitMembershipPlanCreate(${planInput}): OneFitMembershipPlan
  oneFitMembershipPlanUpdate(_id: String!, ${planUpdateInput}): OneFitMembershipPlan
  oneFitMembershipPlansRemove(ids: [String]!): JSON
  oneFitMembershipPurchaseCreate(${purchaseInput}): OneFitMembershipPlan

`;
