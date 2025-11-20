const types = `
  type BlockAdminDeveloperAddress {
    countryCode: String
    country: String
    postCode: String
    city: String
    city_district: String
    suburb: String
    road: String
    street: String
    building: String
    number: String
    other: String
  }

  type BlockAdminDeveloperLocation {
    type: String
    coordinates: [Int]
  }

  type BlockAdminDeveloperAddressInfo {
    location: BlockAdminDeveloperLocation
    address: BlockAdminDeveloperAddress
    short: String
  }

  type BlockAdminDeveloperSocialLink {
    facebook: String
    twitter: String
    instagram: String
    linkedin: String
    youtube: String
    website: String
  }
`;

export const developer = `
  ${types}
`;
