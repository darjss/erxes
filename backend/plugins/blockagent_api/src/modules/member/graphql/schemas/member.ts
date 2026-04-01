export const types = `
  type BlockMember {
    _id: String
    agencyId: String

    description: String
    country: String
    city: String
    district: String
    facebookUrl: String
    instagramUrl: String
    linkedUrl: String
    certificatePhotos: [String]

    createdAt: Date
    updatedAt: Date
  }

  input MemberInput {
    agencyId: String
    description: String
    country: String
    city: String
    district: String
    facebookUrl: String
    instagramUrl: String
    linkedUrl: String
    certificatePhotos: [String]
  }
`;

export const queries = `
  getMember(_id: String!): BlockMember
  getMembers(agencyId: String, page: Int, perPage: Int): [BlockMember]
  getMembersTotalCount(agencyId: String): Int
`;

export const mutations = `
  createMember(input: MemberInput!): BlockMember
  updateMember(_id: String!, input: MemberInput!): BlockMember
  removeMember(_id: String!): Boolean
`;
