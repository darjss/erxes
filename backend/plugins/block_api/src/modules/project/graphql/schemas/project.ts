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

  enum BlockProjectStatus {
    verified
    unverified
    pending
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
    location: BlockProjectLocation
    status: BlockProjectStatus
    coverImage: String
    mainPrice: Int
    prices: [BlockProjectPrice]
    bankPartners: [String]
    projectAmenities: [BlockProjectAmenity]
    bankPartners: [String]
  }

  input BlockProjectGeneralInput {
    name: String
    coverImage: String
    location: BlockProjectLocationInput
    status: BlockProjectStatus
    mainPrice: Int
    prices: [BlockProjectPriceInput]
    bankPartners: [String]
    projectAmenities: [BlockProjectAmenityInput]
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
