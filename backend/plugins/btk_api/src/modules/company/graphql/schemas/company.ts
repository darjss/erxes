export const types = `
  type CompanySocialLink {
    facebook: String
    twitter: String
    instagram: String
    linkedin: String
    youtube: String
    website: String
  }

 type Company @key(fields: "_id") {
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
    socialLinks: CompanySocialLink
    isVerified: Boolean
  }

  input CompanySocialLinkInput {
    facebook: String
    twitter: String
    instagram: String
    linkedin: String
    youtube: String
    website: String
  }

  input CompanyInput {
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
    socialLinks: CompanySocialLinkInput
  }
`;

export const queries = `
  getCompanyInfo: Company
`;

export const mutations = `
  updateCompanyInfo(input: CompanyInput): Company
`;
