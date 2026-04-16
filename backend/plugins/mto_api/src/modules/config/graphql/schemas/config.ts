import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type MtoSystemConfig {
    _id: String
    createdAt: Date
    modifiedAt: Date
    key: String
    value: JSON
    description: String
  }

  type MtoSystemConfigListResponse {
    list: [MtoSystemConfig]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const configQueryParams = `
  searchValue: String,
  key: String,
`;

export const queries = `
  mtoSystemConfigs(${configQueryParams}, ${GQL_CURSOR_PARAM_DEFS}): MtoSystemConfigListResponse
  mtoSystemConfigsCount(${configQueryParams}): Int
  mtoSystemConfig(_id: String): MtoSystemConfig
  mtoSystemConfigByKey(key: String!): MtoSystemConfig
  mtoAllSystemConfigs: [MtoSystemConfig]
  mtoMode: String
  mtoMasterUrl: String
  mtoInstanceId: String
  mtoSuggestedInstanceId: String
`;

const configInput = `
  key: String!
  value: JSON!
  description: String
`;

export const mutations = `
  mtoSystemConfigCreate(${configInput}): MtoSystemConfig
  mtoSystemConfigUpdate(key: String!, value: JSON!): MtoSystemConfig
  mtoSystemConfigsRemove(keys: [String]!): JSON
  mtoSystemConfigUpdateSelectedPayments(paymentIds: [String]!): MtoSystemConfig
`;
