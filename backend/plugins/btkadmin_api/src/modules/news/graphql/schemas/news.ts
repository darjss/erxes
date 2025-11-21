export const types = `
  type btkAdminNewsLocation {
    lat: Float
    lng: Float
    city: String
    district: String
    address: String
    parcelId: String
  }

  input btkAdminNewsLocationInput {
    lat: Float
    lng: Float
    city: String
    district: String
    address: String
    parcelId: String
  }

  enum btkAdminAdminNewsVerificationStatus {
    verified
    unverified
    pending
  }
  enum btkAdminAdminNewsStatus {
    planned
    on_going
    on_sale
    completed
  }


  input btkAdminNewsAmenityInput {
    category: String
    amenities: [String]
  }

  type btkAdminNewsAmenity {
    category: String
    amenities: [String]
  }

  type btkAdminNews {
    _id: String
    name: String
    isPublished: Boolean
    location: btkAdminNewsLocation
    verificationStatus: btkAdminAdminNewsVerificationStatus
    images: [String]
    companyId: String
    title: String
    content: String
    status: btkAdminAdminNewsStatus
    coverImage: String
    logo: String
    newsAmenities: [btkAdminNewsAmenity]
    startDate: Date
    endDate: Date
    createdAt: Date
    updatedAt: Date
  }


`;

export const queries = `
  btkAdminGetNews(_id: String!): btkAdminNews
  btkAdminGetAllNews: [btkAdminNews]
`;
