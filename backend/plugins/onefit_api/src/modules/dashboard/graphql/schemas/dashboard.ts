export const types = `
  type OneFitDashboardMetric {
    value: Float!
    previousValue: Float
    changePercent: Float
  }

  type OneFitDashboardCategoryStat {
    categoryId: String!
    label: String!
    parentId: String
    depth: Int!
    count: Int!
    percent: Float!
  }

  type OneFitDashboardPackageStat {
    planId: String!
    planName: String!
    activeCustomerCount: Int!
    totalCredit: Float!
    consumedCredit: Float!
    checkInCount: Int!
    usagePercent: Float!
  }

  type OneFitDashboardB2bB2cSales {
    b2bCount: Int!
    b2cCount: Int!
    b2bPercent: Float!
    b2cPercent: Float!
  }

  type OneFitDashboardStats {
    totalOneFitUsers: OneFitDashboardMetric!
    activeUsersInPeriod: OneFitDashboardMetric!
    newUsersInPeriod: OneFitDashboardMetric!
    b2bOrganizationsActive: OneFitDashboardMetric!
    averageBookingsPerActiveUserInPeriod: OneFitDashboardMetric!
    b2bB2cSales: OneFitDashboardB2bB2cSales!
    categoryDistribution: [OneFitDashboardCategoryStat!]!
    packageStats: [OneFitDashboardPackageStat!]!
  }
`;

export const queries = `
  oneFitDashboardStats(startDate: Date!, endDate: Date!): OneFitDashboardStats
`;
