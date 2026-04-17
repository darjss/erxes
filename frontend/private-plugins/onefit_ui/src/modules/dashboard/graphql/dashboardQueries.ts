import { gql } from '@apollo/client';

export const ONE_FIT_DASHBOARD_STATS = gql`
  query OneFitDashboardStats($startDate: Date!, $endDate: Date!) {
    oneFitDashboardStats(startDate: $startDate, endDate: $endDate) {
      totalOneFitUsers {
        value
        previousValue
        changePercent
      }
      activeUsersInPeriod {
        value
        previousValue
        changePercent
      }
      newUsersInPeriod {
        value
        previousValue
        changePercent
      }
      b2bOrganizationsActive {
        value
        previousValue
        changePercent
      }
      averageBookingsPerActiveUserInPeriod {
        value
        previousValue
        changePercent
      }
      b2bB2cSales {
        b2bCount
        b2cCount
        b2bPercent
        b2cPercent
      }
      userGrowthByMonth {
        monthKey
        b2bUsers
        b2cUsers
        newUsers
      }
      categoryDistribution {
        categoryId
        label
        parentId
        depth
        count
        percent
      }
      packageStats {
        planId
        planName
        activeCustomerCount
        totalCredit
        consumedCredit
        checkInCount
        usagePercent
      }
    }
  }
`;
