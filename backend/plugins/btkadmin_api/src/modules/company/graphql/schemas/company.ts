export const types = `
  type BtkAdminCompany {
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
    socialLinks: BtkAdminCompanySocialLink
    isVerified: Boolean
  }

`;

export const queries = `
  btkAdminCompanies: [BtkAdminCompany]
  btkAdminCompanyInfo(_id: String): BtkAdminCompany
`;
