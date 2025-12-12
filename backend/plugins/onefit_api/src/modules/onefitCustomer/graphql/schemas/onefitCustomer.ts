import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  enum OneFitMembershipStatus {
    active
    expired
    none
  }

  type OneFitBookingPreferences {
    preferredTimeSlots: [String]
    preferredDays: [String]
    notificationEnabled: Boolean
  }

  extend type Customer @key(fields: "_id") {
    # Membership information
    oneFitMembershipPlanId: String
    oneFitMembershipExpiresAt: Date
    oneFitMembershipStatus: OneFitMembershipStatus

    # Credit information
    oneFitCurrentCreditBalance: Float
    oneFitTotalCreditsEarned: Float
    oneFitTotalCreditsUsed: Float

    # Booking preferences and history
    oneFitPreferredActivityTypes: [String]
    oneFitBookingPreferences: OneFitBookingPreferences
    oneFitLastBookingDate: Date
    oneFitTotalBookings: Int
  }

  type OneFitCustomerListResponse {
    list: [Customer]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const oneFitCustomerQueryParams = `
  searchValue: String
  membershipPlanId: String
  membershipStatus: OneFitMembershipStatus
  minCreditBalance: Float
  maxCreditBalance: Float
  preferredActivityTypeId: String
`;

export const queries = `
  oneFitCustomers(${oneFitCustomerQueryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitCustomerListResponse
  oneFitCustomer(_id: String!): Customer
  oneFitCustomersCount(${oneFitCustomerQueryParams}): Int
`;

export const mutations = `
  oneFitCustomerUpdateMembership(
    _id: String!
    membershipPlanId: String!
    expiresAt: Date!
  ): Customer

  oneFitCustomerUpdateCreditBalance(
    _id: String!
    balance: Float!
  ): Customer

  oneFitCustomerUpdateBookingPreferences(
    _id: String!
    preferences: JSON
  ): Customer
`;
