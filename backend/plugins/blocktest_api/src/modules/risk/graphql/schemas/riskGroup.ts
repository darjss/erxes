import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
    type CVRiskGroup {
        _id: String
        name: String
        client: String
        effective_date: Date
        expiration_date: Date
        createdAt: Date
        updatedAt: Date
    }

    input CVRiskGroupInput {
        name: String
        client: String
        effective_date: Date
        expiration_date: Date
    }

    input CVRiskGroupFilterInput {
        name: String
        client: String
        effective_date: Date
        expiration_date: Date
    }

    type CVRiskGroupListResponse {
        list: [CVRiskGroup]
        pageInfo: PageInfo
        totalCount: Int
    }
`;

export const queries = `
    cvGetRiskGroup(_id: String!): CVRiskGroup
    cvGetRiskGroups(filter: CVRiskGroupFilterInput, ${GQL_CURSOR_PARAM_DEFS}): CVRiskGroupListResponse
`;

export const mutations = `
    cvCreateRiskGroup(input: CVRiskGroupInput!): CVRiskGroup
    cvUpdateRiskGroup(_id: String!, input: CVRiskGroupInput!): CVRiskGroup
    cvDeleteRiskGroup(_id: String!): CVRiskGroup
`;
