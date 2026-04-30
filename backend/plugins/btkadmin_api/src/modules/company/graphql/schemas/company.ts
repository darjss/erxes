export const types = `
  type BtkAdminCompany {
    _id: String
    entityId: String
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
    verificationStatus: String
  }

  enum CompanyVerificationStatus {
    pending
    need_info
    approved
    rejected
    violation
  }

`;

export const mutations = `
  btkAdminUpdateCompanyVerificationStatus(
    _id: String!
    verificationStatus: CompanyVerificationStatus!
  ): BtkAdminCompany
`;

export const queries = `
  btkAdminCompanies: [BtkAdminCompany]
  btkAdminCompanyInfo(_id: String): BtkAdminCompany
`;
