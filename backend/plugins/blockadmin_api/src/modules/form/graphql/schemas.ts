import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
    type BlockSubmission {
        _id: String
        lead: Customer
        form: Int
        answer1: String
        answer2: String
        answer3: String
        answer4: String
        answer5: String
        answer6: String
        submittedAt: Date
    }

    input BlockSubmissionInput {
        form: Int
        answer1: String
        answer2: String
        answer3: String
        answer4: String
        answer5: String
        answer6: String
    }

    type BlockSubmissionList {
        list: [BlockSubmission]
        totalCount: Int
        pageInfo: PageInfo
    }
`;

const queryParams = `
    formId: Int
    ${GQL_CURSOR_PARAM_DEFS}
`;

export const queries = `
    blockAdminGetSubmissions(${queryParams}): BlockSubmissionList
`;

export const mutations = `
    blockAdminSubmitForm(input: BlockSubmissionInput!): BlockSubmission
    blockAdminRemoveSubmissions(_ids: [String]): JSON
`;
