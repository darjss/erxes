export const types = `
  enum BlockBuildingUnitUsageType {
    apartment
    office
    serviceArea
    parking
    basement
    residential
    retail
  }

  enum BlockPriceType {
    priceBySize
    priceByUnit
  }

  type BlockBuildingPriceList {
    currency: String
    priceType: BlockPriceType
    price: Int
  }

  enum BlockBuildingUnitTenureType {
    forSale
    forRent
    forLease
    any
  }

  type BlockBuildingZoning {
    _id: String
    building: String
    floor: Int
    usageType: BlockBuildingUnitUsageType
    tenureType: BlockBuildingUnitTenureType
    unitsCount: Int
    size: Int
    priceList: [BlockBuildingPriceList]
  }
`;

export const queries = `
  blockGetBuildingZonings(building: String!): [BlockBuildingZoning]
  blockGetBuildingZoning(_id: String!): BlockBuildingZoning
`;
