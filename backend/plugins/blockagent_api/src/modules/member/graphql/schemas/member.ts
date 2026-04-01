export const types = `
  type BlockMember {
    _id: String
    agencyId: String
    memberId: String
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
    memberId: String
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
  blockGetMember(_id: String!): BlockMember
  blockGetMembers(agencyId: String, page: Int, perPage: Int): [BlockMember]
  blockGetMembersTotalCount(agencyId: String): Int
`;

export const mutations = `
  blockCreateMember(input: MemberInput!): BlockMember
  blockUpdateMember(_id: String!, input: MemberInput!): BlockMember
  blockRemoveMember(_id: String!): Boolean
`;
