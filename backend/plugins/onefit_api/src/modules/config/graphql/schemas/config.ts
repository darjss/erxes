import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type OneFitSystemConfig {
    _id: String
    createdAt: Date
    modifiedAt: Date
    key: String
    value: JSON
    description: String
  }

  type OneFitSystemConfigListResponse {
    list: [OneFitSystemConfig]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const configQueryParams = `
  searchValue: String,
  key: String,
`;

export const queries = `
  oneFitSystemConfigs(${configQueryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitSystemConfigListResponse
  oneFitSystemConfigsCount(${configQueryParams}): Int
  oneFitSystemConfig(_id: String): OneFitSystemConfig
  oneFitSystemConfigByKey(key: String!): OneFitSystemConfig
  oneFitAllSystemConfigs: [OneFitSystemConfig]
`;

const configInput = `
  key: String!
  value: JSON!
  description: String
`;

export const mutations = `
  oneFitSystemConfigCreate(${configInput}): OneFitSystemConfig
  oneFitSystemConfigUpdate(key: String!, value: JSON!): OneFitSystemConfig
  oneFitSystemConfigsRemove(keys: [String]!): JSON
`;
