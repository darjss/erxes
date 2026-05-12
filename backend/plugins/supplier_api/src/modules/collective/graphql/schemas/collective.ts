export const types = `
  type CollectiveSocialLink {
    facebook: String
    twitter: String
    instagram: String
    linkedin: String
    youtube: String
    website: String
  }

  type Collective {
    _id: String!
    name: String
    description: String
    about: String
    logo: String
    coverImage: String
    registrationNumber: String
    address: JSON
    primaryEmail: String
    primaryPhone: String
    emails: [String]
    phones: [String]
    dateFounded: String
    website: String
    verificationStatus: String
    verificationNote: String
    tierLevel: Int
    socialLinks: CollectiveSocialLink
    ownerUserId: String
    createdAt: Date
    updatedAt: Date
  }

  type CollectiveMemberSupplier {
    _id: String!
    name: String
    logo: String
    primaryEmail: String
    primaryPhone: String
    verificationStatus: String
  }

  input CollectiveInput {
    name: String
    description: String
    about: String
    logo: String
    coverImage: String
    registrationNumber: String
    address: JSON
    primaryEmail: String
    primaryPhone: String
    emails: [String]
    phones: [String]
    dateFounded: String
    website: String
    socialLinks: JSON
  }
`;

export const queries = `
  getCollective: Collective
  collectiveDetail(_id: String!): Collective
  collectiveSuppliers: [CollectiveMemberSupplier]
`;

export const mutations = `
  collectiveUpdateProfile(input: CollectiveInput!): Collective
`;
