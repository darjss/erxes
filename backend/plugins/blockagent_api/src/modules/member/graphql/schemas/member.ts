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
  blockAgentGetMember(_id: String!): BlockMember
  blockAgentGetMembers(agencyId: String, page: Int, perPage: Int): [BlockMember]
  blockAgentGetMembersTotalCount(agencyId: String): Int
`;

export const mutations = `
  blockAgentCreateMember(input: MemberInput!): BlockMember
  blockAgentUpdateMember(_id: String!, input: MemberInput!): BlockMember
  blockAgentRemoveMember(_id: String!): Boolean
`;
