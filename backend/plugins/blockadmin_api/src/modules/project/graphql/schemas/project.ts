export const types = `
  type BlockAdminProjectLocation {
    lat: Float
    lng: Float
    city: String
    district: String
    address: String
    parcelId: String
  }

  input BlockAdminProjectLocationInput {
    lat: Float
    lng: Float
    city: String
    district: String
    address: String
    parcelId: String
  }

  enum BlockAdminProjectVerificationStatus {
    verified
    unverified
    pending
  }

  enum BlockAdminProjectStatus {
    planned
    on_going
    on_sale
    completed
  }

  enum BlockAdminProjectPriceType {
    priceBySize
    priceByUnit
  }

  type BlockAdminProjectPrice {
    currency: String
    priceType: BlockAdminProjectPriceType
    price: Int
  }

  input BlockAdminProjectPriceInput {
    currency: String
    priceType: BlockAdminProjectPriceType
    price: Int
  }

  input BlockAdminProjectAmenityInput {
    category: String
    amenities: [String]
  }

  type BlockAdminProjectAmenity {
    category: String
    amenities: [String]
  }

  type BlockAdminProject {
    _id: String
    name: String
    isPublished: Boolean
    location: BlockAdminProjectLocation
    verificationStatus: BlockAdminProjectVerificationStatus
    status: BlockAdminProjectStatus
    coverImage: String
    mainPrice: Int
    prices: [BlockAdminProjectPrice]
    projectAmenities: [BlockAdminProjectAmenity]
    bankPartners: [String]

    startDate: Date
    endDate: Date
  }

  input BlockAdminProjectGeneralInput {
    name: String
    coverImage: String
    location: BlockAdminProjectLocationInput
    verificationStatus: BlockAdminProjectVerificationStatus
    status: BlockAdminProjectStatus
    mainPrice: Int
    prices: [BlockAdminProjectPriceInput]
    bankPartners: [String]
    projectAmenities: [BlockAdminProjectAmenityInput]

    startDate: Date
    endDate: Date
  }
`;

export const queries = `
  blockAdminGetProject(_id: String!): BlockAdminProject
  blockAdminGetProjects: [BlockAdminProject]
`;

export const mutations = `
  blockAdminCreateProject(name: String!): BlockAdminProject
  blockAdminUpdateProjectGeneralInfo(_id: String!, input: BlockAdminProjectGeneralInput!): BlockAdminProject
  blockAdminPublishProject(_id: String!): BlockAdminProject
  blockAdminRemoveProject(_id: String!): BlockAdminProject
`;
