const enums = `
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

  enum BtkAdminNewsPriceType {
    priceBySize
    priceByUnit
  }
`;

const types = `
  type BtkAdminNewsLocation {
    lat: Float
    lng: Float
    city: String
    district: String
    address: String
    parcelId: String
  }

  type BtkAdminNewsPrice {
    currency: String
    priceType: BtkAdminNewsPriceType
    price: Int
  }

  type BtkAdminNewsAmenity {
    category: String
    amenities: [String]
  }
`;

const inputs = `
  input BtkAdminNewsLocationInput {
    lat: Float
    lng: Float
    city: String
    district: String
    address: String
    parcelId: String
  }

  input BtkAdminNewsPriceInput {
    currency: String
    priceType: BtkAdminNewsPriceType
    price: Int
  }

  input BtkAdminNewsAmenityInput {
    category: String
    amenities: [String]
  }

  input BtkAdminNewsGeneralInput {
    name: String
    coverImage: String
    logo: String
    location: BtkAdminNewsLocationInput
    verificationStatus: BtkAdminNewsVerificationStatus
    status: BtkAdminNewsStatus
    mainPrice: Int
    prices: [BtkAdminNewsPriceInput]
    bankPartners: [String]
    newsAmenities: [BtkAdminNewsAmenityInput]
    title: String
    content: String
    images: [String]
    startDate: Date
    endDate: Date
  }
`;

export const news = `
  ${enums}
  ${types}
  ${inputs}
`;
