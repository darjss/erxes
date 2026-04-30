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
    verificationStatus: String
  }

  enum CompanyVerificationStatus {
    pending
    need_info
    approved
    rejected
    violation
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
  getCompanyInfo(_id: String!): Company
  getCompanyCompanies: [Company]
`;

export const mutations = `
  updateCompanyInfo(_id: String!, input: CompanyInput): Company
`;
