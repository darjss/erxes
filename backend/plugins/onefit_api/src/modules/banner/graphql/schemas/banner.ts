import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type OneFitBanner {
    _id: String
    createdAt: Date
    modifiedAt: Date
    image: String
    providerId: String
    type: String
    status: String
  }

  type OneFitBannerListResponse {
    list: [OneFitBanner]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const queryParams = `
  providerId: String,
  type: String,
  status: String,
`;

export const queries = `
  oneFitBanners(${queryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitBannerListResponse
  oneFitBannersCount(${queryParams}): Int
  oneFitBanner(_id: String): OneFitBanner
`;

const mutationParams = `
  image: String!
  providerId: String!
  type: String!
  status: String
`;

export const mutations = `
  oneFitBannerCreate(${mutationParams}): OneFitBanner
  oneFitBannerUpdate(_id: String!, ${mutationParams}): OneFitBanner
  oneFitBannersRemove(ids: [String]!): JSON
`;
