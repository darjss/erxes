export const types = `
  type BtkProjectLocation {
    lat: Float
    lng: Float
    city: String
    district: String
    address: String
    parcelId: String
  }

  input BtkProjectLocationInput {
    lat: Float
    lng: Float
    city: String
    district: String
    address: String
    parcelId: String
  }

  enum BtkAdminProjectVerificationStatus {
    verified
    unverified
    pending
  }

  enum BtkAdminProjectStatus {
    planned
    on_going
    on_sale
    completed
  }

  enum BtkProjectPriceType {
    priceBySize
    priceByUnit
  }

  type BtkProjectPrice {
    currency: String
    priceType: BtkProjectPriceType
    price: Int
  }

  input BtkProjectPriceInput {
    currency: String
    priceType: BtkProjectPriceType
    price: Int
  }

  input BtkProjectAmenityInput {
    category: String
    amenities: [String]
  }

  type BtkProjectAmenity {
    category: String
    amenities: [String]
  }

  type BtkProject {
    _id: String
    name: String
    isPublished: Boolean
    location: BtkProjectLocation
    verificationStatus: BtkAdminProjectVerificationStatus
    status: BtkAdminProjectStatus
    coverImage: String
    mainPrice: Int
    prices: [BtkProjectPrice]
    projectAmenities: [BtkProjectAmenity]
    bankPartners: [String]

    startDate: Date
    endDate: Date
  }

  input BtkProjectGeneralInput {
    name: String
    coverImage: String
    location: BtkProjectLocationInput
    verificationStatus: BtkAdminProjectVerificationStatus
    status: BtkAdminProjectStatus
    mainPrice: Int
    prices: [BtkProjectPriceInput]
    bankPartners: [String]
    projectAmenities: [BtkProjectAmenityInput]

    startDate: Date
    endDate: Date
  }
`;

export const queries = `
  btkGetProject(_id: String!): BtkProject
  btkGetProjects: [BtkProject]
`;

export const mutations = `
  btkCreateProject(name: String!): BtkProject
  btkUpdateProjectGeneralInfo(_id: String!, input: BtkProjectGeneralInput!): BtkProject
  btkPublishProject(_id: String!): BtkProject
  btkRemoveProject(_id: String!): BtkProject
`;
