export const types = `
  type OneFitDashboardMetric {
    value: Float!
    previousValue: Float
    changePercent: Float
  }

  type OneFitDashboardStats {
    totalOneFitUsers: OneFitDashboardMetric!
    activeUsersInPeriod: OneFitDashboardMetric!
    newUsersInPeriod: OneFitDashboardMetric!
    b2bOrganizationsActive: OneFitDashboardMetric!
    averageBookingsPerActiveUserInPeriod: OneFitDashboardMetric!
  }
`;

export const queries = `
  oneFitDashboardStats(startDate: Date!, endDate: Date!): OneFitDashboardStats
`;
