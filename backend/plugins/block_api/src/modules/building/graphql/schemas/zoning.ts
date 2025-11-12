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

  input BlockBuildingPriceListInput {
    currency: String
    priceType: BlockPriceType
    price: Int
  }

  enum BlockBuildingUnitTenureType {
    forSale
    forLease
    any
  }
    
  enum BlockUnitStatus {
    available
    reserved
    sold
    underFinance
    cancelled
    onHold
  }

  input BlockBuildingZoningInput {
    building: String
    floor: Int
    usageType: BlockBuildingUnitUsageType
    tenureType: BlockBuildingUnitTenureType
    priceList: [BlockBuildingPriceListInput]
    size: Int

    useProjectPrice: Boolean
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

export const mutations = `
  blockCreateBuildingZoning(input: BlockBuildingZoningInput!): BlockBuildingZoning
  blockDupplicateBuildingZoning(_id: String!): BlockBuildingZoning
  blockUpdateBuildingZoning(_id: String!, input: BlockBuildingZoningInput!): BlockBuildingZoning
  blockDeleteBuildingZoning(_id: String!): BlockBuildingZoning
`;
