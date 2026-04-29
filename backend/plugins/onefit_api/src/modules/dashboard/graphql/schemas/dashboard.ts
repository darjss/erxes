export const types = `
  type OneFitDashboardCheckInCount {
    attended: Int!
    noShow: Int!
    cancelled: Int!
  }

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
    currentCreditTotal: Float!
    totalCredit: Float!
    consumedCredit: Float!
    checkInCount: OneFitDashboardCheckInCount!
    usagePercent: Float!
  }

  type OneFitDashboardCompanyUserStat {
    companyId: String!
    companyName: String!
    userId: String!
    userName: String!
    userPhone: String
    planId: String!
    planName: String!
    lastPurchaseDate: Date
    planCredit: Float!
    creditBeforeLastPurchase: Float!
    lastExpirationCredit: Float!
    currentCredit: Float!
    usedCredit: Float!
  }

  type OneFitDashboardB2bB2cSales {
    b2bCount: Int!
    b2cCount: Int!
    b2bPercent: Float!
    b2cPercent: Float!
  }

  type OneFitDashboardUserGrowthMonth {
    monthKey: String!
    b2bUsers: Int!
    b2cUsers: Int!
    newUsers: Int!
  }

  type OneFitDashboardBookingStatusDay {
    dayKey: String!
    bookings: Int!
    completed: Int!
    noShow: Int!
  }

  type OneFitDashboardStats {
    totalOneFitUsers: OneFitDashboardMetric!
    activeUsersInPeriod: OneFitDashboardMetric!
    newUsersInPeriod: OneFitDashboardMetric!
    b2bOrganizationsActive: OneFitDashboardMetric!
    averageBookingsPerActiveUserInPeriod: OneFitDashboardMetric!
    b2bB2cSales: OneFitDashboardB2bB2cSales!
    userGrowthByMonth: [OneFitDashboardUserGrowthMonth!]!
    bookingStatusByDay: [OneFitDashboardBookingStatusDay!]!
    categoryDistribution: [OneFitDashboardCategoryStat!]!
    packageStats: [OneFitDashboardPackageStat!]!
    companyUserStats: [OneFitDashboardCompanyUserStat!]!
  }
`;

export const queries = `
  oneFitDashboardStats(
    startDate: Date!
    endDate: Date!
    planId: String
  ): OneFitDashboardStats
`;
