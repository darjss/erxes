export const types = `
  type GeoPoint {
    type: String
    coordinates: [Float]
  }

  type BlockListingLocation {
    city: String!
    district: String!
    subDistrict: String!
    short: String
    geoPoint: GeoPoint
  }

  type BlockListingPricing {
    amount: Float!
    currency: String
    priceType: ListingPriceType
  }

  type BlockListingSpecs {
    area: Float!
    floor: Int
    totalFloors: Int
    rooms: Int
    builtYear: String
  }

  type BlockListing {
    _id: ID!
    title: String!
    type: ListingType!
    propertyType: String!
    status: ListingStatus!
    description: String!
    location: BlockListingLocation!
    pricing: BlockListingPricing!
    specs: BlockListingSpecs!
    mediaAttachments: [String]
    createdAt: String
    updatedAt: String
  }

  enum ListingType {
    sale
    rent
    lease
  }

  enum ListingStatus {
    active
    inactive
    sold
    draft
  }

  enum ListingPriceType {
    fixed
    negotiable
    onRequest
  }

  input GeoPointInput {
    type: String
    coordinates: [Float]
  }

  input BlockListingLocationInput {
    city: String!
    district: String!
    subDistrict: String!
    short: String
    geoPoint: GeoPointInput
  }

  input BlockListingPricingInput {
    amount: Float!
    currency: String
    priceType: ListingPriceType
  }

  input BlockListingSpecsInput {
    area: Float!
    floor: Int
    totalFloors: Int
    rooms: Int
    builtYear: String
  }

  input BlockListingInput {
    title: String!
    type: ListingType!
    propertyType: String!
    status: ListingStatus
    description: String
    location: BlockListingLocationInput!
    pricing: BlockListingPricingInput!
    specs: BlockListingSpecsInput!
    mediaAttachments: [String]
  }
`;

export const queries = `
  blockGetListing(_id: String!): BlockListing
  blockGetListings: [BlockListing]
`;

export const mutations = `
  blockCreateListing(name: String!): BlockListing
  blockUpdateListingGeneralInfo(_id: String!, input: BlockListingInput!): BlockListing
  blockRemoveListing(_id: String!): BlockListing
`;
