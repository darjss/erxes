export const types = `
    type BlockNote {
        _id: String
        content: String
        contentId: String
        createdBy: String
        mentions: [String]

        createdAt: String
        updatedAt: String
    }

    enum EnumBlockNoteContentType {
        oppty
    }
`;

const createBlockNoteParams = `
    content: String
    contentId: String
    mentions: [String]
    contentType: EnumBlockNoteContentType
`;

const updateBlockNoteParams = `
    _id: String!
    content: String
    contentId: String
    mentions: [String]
`;

export const queries = `
    blockGetNote(_id: String!): BlockNote
`;

export const mutations = `
    blockCreateNote(${createBlockNoteParams}): BlockNote
    blockUpdateNote(${updateBlockNoteParams}): BlockNote
    blockDeleteNote(_id: String!): JSON
`;
