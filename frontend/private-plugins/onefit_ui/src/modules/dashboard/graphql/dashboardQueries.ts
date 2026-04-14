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
      categoryDistribution {
        categoryId
        label
        parentId
        depth
        count
        percent
      }
    }
  }
`;
