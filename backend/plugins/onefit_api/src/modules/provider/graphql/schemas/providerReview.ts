import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const providerReviewTypes = `
  type OneFitProviderReview {
    _id: String
    providerId: String
    userId: String
    activityTypeId: String
    rating: Float
    comment: String
    createdAt: Date
    modifiedAt: Date
    user: OneFitCustomer
  }

  type OneFitProviderReviewListResponse {
    list: [OneFitProviderReview]
    pageInfo: PageInfo
    totalCount: Int
  }

  type OneFitProviderReviewSummary {
    averageRating: Float
    reviewCount: Int
  }
`;

export const providerReviewQueries = `
  oneFitProviderReviews(providerId: String!, ${GQL_CURSOR_PARAM_DEFS}): OneFitProviderReviewListResponse
  oneFitProviderReviewSummary(providerId: String!): OneFitProviderReviewSummary
`;

export const providerReviewMutations = `
  cpOneFitProviderReviewAdd(
    providerId: String!
    activityTypeId: String
    rating: Float!
    comment: String
  ): OneFitProviderReview
  cpOneFitProviderReviewUpdate(
    _id: String!
    activityTypeId: String
    rating: Float
    comment: String
  ): OneFitProviderReview
  cpOneFitProviderReviewRemove(_id: String!): JSON
`;
