export const types = `
  type DeveloperSocialLink {
    facebook: String
    twitter: String
    instagram: String
    linkedin: String
    youtube: String
    website: String
  }

  type Developer {
    _id: String
    name: String
    description: String
    about: String
    logo: String
    website: String
    registrationNumber: String
    address: DeveloperAddressInfo
    dateFounded: String
    primaryEmail: String
    primaryPhone: String
    coverImage: String
    phones: [String]
    socialLinks: DeveloperSocialLink
    verificationStatus: String
  }

  input DeveloperSocialLinkInput {
    facebook: String
    twitter: String
    instagram: String
    linkedin: String
    youtube: String
    website: String
  }

  input DeveloperInput {
    name: String
    description: String
    about: String
    logo: String
    website: String
    registrationNumber: String
    address: DeveloperAddressInfoInput
    dateFounded: String
    primaryEmail: String
    primaryPhone: String
    coverImage: String
    phones: [String]
    socialLinks: DeveloperSocialLinkInput
  }
`;

export const queries = `
  getDeveloperInfo: Developer
`;

export const mutations = `
  updateDeveloperInfo(input: DeveloperInput): Developer
  updateDeveloperVerificationStatus: Developer
`;
