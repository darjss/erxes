export const types = `
    type BlockSubmission {
        userId: String
        form: Int
        answer1: String
        answer2: String
        answer3: String
        answer4: String
        submittedAt: Date
    }

    input BlockSubmissionInput {
        userId: String
        form: Int
        answer1: String
        answer2: String
        answer3: String
        answer4: String
    }
`;

export const mutations = `
    blockAdminSubmitForm(input: BlockSubmissionInput!): BlockSubmission
`;
