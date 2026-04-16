import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type MushopSupplierSocialLink {
    facebook: String
    twitter: String
    instagram: String
    linkedin: String
    youtube: String
    website: String
  }

  type MushopSupplier {
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
    tierLevel: Int
    socialLinks: MushopSupplierSocialLink
    ownerUserId: String
    createdAt: Date
    updatedAt: Date
  }

  type MushopSupplierListResponse {
    list: [MushopSupplier]
    pageInfo: PageInfo
    totalCount: Int
  }

  input MushopSupplierInput {
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

const supplierQueryParams = `
  searchValue: String
  verificationStatus: String
  city: String
  district: String
  dateFilters: String
  isFeatured: Boolean
  ${GQL_CURSOR_PARAM_DEFS}
`;

export const queries = `
  mushopSupplierDetail(_id: String!): MushopSupplier
  mushopSuppliers(${supplierQueryParams}): MushopSupplierListResponse
`;

export const mutations = `
  mushopUpdateSupplier(_id: String!, input: MushopSupplierInput!): MushopSupplier
  mushopUpdateSupplierVerificationStatus(_id: String!, verificationStatus: String!): MushopSupplier
  mushopUpdateSupplierTier(_id: String!, tierLevel: Int!): MushopSupplier
`;
