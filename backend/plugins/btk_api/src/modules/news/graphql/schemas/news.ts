export const types = `
  type BtkNewsLocation {
    lat: Float
    lng: Float
    city: String
    district: String
    address: String
    parcelId: String
  }

  input BtkNewsLocationInput {
    lat: Float
    lng: Float
    city: String
    district: String
    address: String
    parcelId: String
  }

  enum BtkAdminNewsVerificationStatus {
    verified
    unverified
    pending
  }
  enum BtkAdminNewsStatus {
    planned
    on_going
    on_sale
    completed
  }

  enum BtkNewsPriceType {
    priceBySize
    priceByUnit
  }

  type BtkNewsPrice {
    currency: String
    priceType: BtkNewsPriceType
    price: Int
  }

  input BtkNewsPriceInput {
    currency: String
    priceType: BtkNewsPriceType
    price: Int
  }

  input BtkNewsAmenityInput {
    category: String
    amenities: [String]
  }

  type BtkNewsAmenity {
    category: String
    amenities: [String]
  }

  type BtkNews {
    _id: String
    name: String
    isPublished: Boolean
    location: BtkNewsLocation
    verificationStatus: BtkAdminNewsVerificationStatus
    companyId: String
    title: String
    content: String
    status: BtkAdminNewsStatus
    coverImage: String
    images: [String]
    logo: String
    mainPrice: Int
    prices: [BtkNewsPrice]
    newsAmenities: [BtkNewsAmenity]
    bankPartners: [String]

    startDate: Date
    endDate: Date
  }

  input BtkNewsGeneralInput {
    name: String
    coverImage: String
    logo: String
    images: [String]
    location: BtkNewsLocationInput
    verificationStatus: BtkAdminNewsVerificationStatus
    companyId: String
    title: String
    content: String
    status: BtkAdminNewsStatus
    mainPrice: Int
    prices: [BtkNewsPriceInput]
    bankPartners: [String]
    newsAmenities: [BtkNewsAmenityInput]

    startDate: Date
    endDate: Date
  }
`;

export const queries = `
  btkGetNews(_id: String!): BtkNews
  btkGetAllNews: [BtkNews]
`;

export const mutations = `
  btkCreateNews(name: String!, companyId: String!): BtkNews
  btkUpdateNewsGeneralInfo(_id: String!, input: BtkNewsGeneralInput!): BtkNews
  btkPublishNews(_id: String!): BtkNews
  btkRemoveNews(_id: String!): BtkNews
`;
