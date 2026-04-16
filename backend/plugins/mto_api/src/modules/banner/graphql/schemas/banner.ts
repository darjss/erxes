import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type MtoBanner {
    _id: String
    createdAt: Date
    modifiedAt: Date
    image: String
    providerId: String
    type: String
    status: String
  }

  type MtoBannerListResponse {
    list: [MtoBanner]
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
  mtoBanners(${queryParams}, ${GQL_CURSOR_PARAM_DEFS}): MtoBannerListResponse
  mtoBannersCount(${queryParams}): Int
  mtoBanner(_id: String): MtoBanner
`;

const mutationParams = `
  image: String!
  providerId: String!
  type: String!
  status: String
`;

export const mutations = `
  mtoBannerCreate(${mutationParams}): MtoBanner
  mtoBannerUpdate(_id: String!, ${mutationParams}): MtoBanner
  mtoBannersRemove(ids: [String]!): JSON
`;
