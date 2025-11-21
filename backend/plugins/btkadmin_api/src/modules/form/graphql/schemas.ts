export const types = `
    type BtkSubmission {
        email: String
        name: String
        phone: String
        answer1: String
        answer2: String
        answer3: String
        answer4: String
        answer5: String
        answer6: String
        submittedAt: Date
    }

    input BtkSubmissionInput {
        email: String
        name: String
        phone: String
        answer1: String
        answer2: String
        answer3: String
        answer4: String
        answer5: String
        answer6: String
    }
`;

export const mutations = `
    btkAdminSubmitForm(input: BtkSubmissionInput!): BtkSubmission
`;

export const queries = `
    btkAdminGetAllForms: [BtkSubmission]
`;
