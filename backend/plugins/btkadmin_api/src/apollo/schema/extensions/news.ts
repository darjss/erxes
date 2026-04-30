const enums = `
  enum BtkAdminNewsVerificationStatus {
    pending
    need_info
    approved
    rejected
    violation
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

`;

export const news = `
  ${enums}
  ${types}
  ${inputs}
`;
