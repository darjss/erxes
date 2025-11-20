export const types = `
    type BtkSubmission {
        userId: String
        form: Int
        answer1: String
        answer2: String
        answer3: String
        answer4: String
        submittedAt: Date
    }

    input BtkSubmissionInput {
        userId: String
        form: Int
        answer1: String
        answer2: String
        answer3: String
        answer4: String
    }
`;

export const mutations = `
    btkAdminSubmitForm(input: BtkSubmissionInput!): BtkSubmission
`;
