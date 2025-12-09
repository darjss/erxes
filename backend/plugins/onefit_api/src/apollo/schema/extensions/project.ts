const enums = `
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
`;

const types = `
  type BlockAdminProjectLocation {
    lat: Float
    lng: Float
    city: String
    district: String
    address: String
    parcelId: String
  }

  type BlockAdminProjectPrice {
    currency: String
    priceType: BlockAdminProjectPriceType
    price: Int
  }

  type BlockAdminProjectAmenity {
    category: String
    amenities: [String]
  }
`;

const inputs = `
  input BlockAdminProjectLocationInput {
    lat: Float
    lng: Float
    city: String
    district: String
    address: String
    parcelId: String
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

  input BlockAdminProjectGeneralInput {
    name: String
    coverImage: String
    location: BlockAdminProjectLocationInput
    verificationStatus: BlockAdminDeveloperVerificationStatus
    status: BlockAdminProjectStatus
    mainPrice: Int
    prices: [BlockAdminProjectPriceInput]
    bankPartners: [String]
    projectAmenities: [BlockAdminProjectAmenityInput]

    startDate: Date
    endDate: Date
  }
`;

export const project = `
  ${enums}
  ${types}
  ${inputs}
`;
