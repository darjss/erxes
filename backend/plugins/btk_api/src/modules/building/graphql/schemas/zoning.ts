export const types = `
  enum BtkBuildingUnitUsageType {
    apartment
    office
    serviceArea
    parking
    basement
    residential
    retail
  }

  enum BtkPriceType {
    priceBySize
    priceByUnit
  }

  type BtkBuildingPriceList {
    currency: String
    priceType: BtkPriceType
    price: Int
  }

  input BtkBuildingPriceListInput {
    currency: String
    priceType: BtkPriceType
    price: Int
  }

  enum BtkBuildingUnitTenureType {
    forSale
    forLease
    any
  }

  enum BtkUnitStatus {
    available
    reserved
    sold
    underFinance
    cancelled
    onHold
  }

  input BtkBuildingZoningInput {
    building: String
    floor: Int
    usageType: BtkBuildingUnitUsageType
    tenureType: BtkBuildingUnitTenureType
    priceList: [BtkBuildingPriceListInput]
    size: Int

    useProjectPrice: Boolean
  }

  type BtkBuildingZoning {
    _id: String
    building: String
    floor: Int
    usageType: BtkBuildingUnitUsageType
    tenureType: BtkBuildingUnitTenureType
    unitsCount: Int
    size: Int
    priceList: [BtkBuildingPriceList]
  }
`;

export const queries = `
  btkGetBuildingZonings(building: String!): [BtkBuildingZoning]
  btkGetBuildingZoning(_id: String!): BtkBuildingZoning
`;

export const mutations = `
  btkCreateBuildingZoning(input: BtkBuildingZoningInput!): BtkBuildingZoning
  btkDupplicateBuildingZoning(_id: String!): BtkBuildingZoning
  btkUpdateBuildingZoning(_id: String!, input: BtkBuildingZoningInput!): BtkBuildingZoning
  btkDeleteBuildingZoning(_id: String!): BtkBuildingZoning
`;
