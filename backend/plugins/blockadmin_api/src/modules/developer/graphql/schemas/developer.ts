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
    address: JSON
    dateFounded: Date
    email: String
    primaryPhone: String
    coverImage: String
    phones: [String]
    socialLinks: DeveloperSocialLink
    isVerified: Boolean
  }
`;

export const queries = `
  getDeveloperInfo: Developer
`;
