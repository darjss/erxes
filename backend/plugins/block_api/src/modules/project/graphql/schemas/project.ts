export const types = `
  type BlockProjectLocation {
    lat: Float
    lng: Float
    city: String
    district: String
    address: String
    parcelId: String
  }

  input BlockProjectLocationInput {
    lat: Float
    lng: Float
    city: String
    district: String
    address: String
    parcelId: String
  }

  enum BlockVerificationStatus {
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

  enum BlockProjectPriceType {
    priceBySize
    priceByUnit
  }

  type BlockProjectPrice {
    currency: String
    priceType: BlockProjectPriceType
    price: Int
  }

  input BlockProjectPriceInput {
    currency: String
    priceType: BlockProjectPriceType
    price: Int
  }

  input BlockProjectAmenityInput {
    category: String
    amenities: [String]
  }

  type BlockProjectAmenity {
    category: String
    amenities: [String]
  }

  type BlockProject {
    _id: String
    name: String
    isPublished: Boolean
    shortDescription: String
    description: String
    location: BlockProjectLocation
    verificationStatus: BlockVerificationStatus
    status: BlockAdminProjectStatus
    coverImage: String
    mainPrice: Int
    prices: [BlockProjectPrice]
    projectAmenities: [BlockProjectAmenity]
    bankPartners: [String]
    types: [String]

    startDate: Date
    endDate: Date

    counts: JSON
    priceRanges: JSON
    progress: Float
  }

  input BlockProjectGeneralInput {
    name: String
    logo: String
    coverImage: String
    shortDescription: String
    description: String
    location: BlockProjectLocationInput
    verificationStatus: BlockVerificationStatus
    status: BlockAdminProjectStatus
    mainPrice: Int
    prices: [BlockProjectPriceInput]
    bankPartners: [String]
    projectAmenities: [BlockProjectAmenityInput]
    types: [String]

    startDate: Date
    endDate: Date
  }
`;

export const queries = `
  blockGetProject(_id: String!): BlockProject
  blockGetProjects: [BlockProject]
`;

export const mutations = `
  blockCreateProject(name: String!): BlockProject
  blockUpdateProjectGeneralInfo(_id: String!, input: BlockProjectGeneralInput!): BlockProject
  blockPublishProject(_id: String!): BlockProject
  blockRemoveProject(_id: String!): BlockProject
`;
