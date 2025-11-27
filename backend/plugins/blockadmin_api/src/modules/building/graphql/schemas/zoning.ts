export const types = `
  enum BlockAdminBuildingUnitUsageType {
    apartment
    office
    serviceArea
    parking
    basement
    residential
    retail
  }

  enum BlockAdminBuildingPriceType {
    priceBySize
    priceByUnit
  }

  type BlockAdminBuildingPriceList {
    currency: String
    priceType: BlockAdminBuildingPriceType
    price: Int
  }

  enum BlockAdminBuildingUnitTenureType {
    forSale
    forLease
    any
  }

  enum BlockAdminUnitStatus {
    available
    reserved
    sold
    underFinance
    cancelled
    onHold
  }

  type BlockAdminBuildingZoning {
    _id: String
    building: String
    floor: Int
    usageType: BlockAdminBuildingUnitUsageType
    tenureType: BlockAdminBuildingUnitTenureType
    unitsCount: Int
    size: Int
    priceList: [BlockAdminBuildingPriceList]
  }
`;

export const queries = `
  blockAdminGetBuildingZonings(building: String!): [BlockAdminBuildingZoning]
  blockAdminGetBuildingZoning(_id: String!): BlockAdminBuildingZoning
`;
