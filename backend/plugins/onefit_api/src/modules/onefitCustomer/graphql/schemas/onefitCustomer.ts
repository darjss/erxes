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

    # Membership hold
    oneFitIsMembershipOnHold: Boolean
    oneFitMembershipHoldStartAt: Date
    oneFitMembershipHoldEndAt: Date
    oneFitMembershipHoldEndedAt: Date

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

  # Parallel type for use in booking/credit consumption (OneFit-specific customer view)
  type OneFitCustomer {
    _id: String
    primaryEmail: String
    primaryPhone: String
    firstName: String
    lastName: String

    # Membership information
    oneFitMembershipPlanId: String
    oneFitMembershipExpiresAt: Date
    oneFitMembershipStatus: OneFitMembershipStatus

    # Membership hold
    oneFitIsMembershipOnHold: Boolean
    oneFitMembershipHoldStartAt: Date
    oneFitMembershipHoldEndAt: Date
    oneFitMembershipHoldEndedAt: Date

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

  type OneFitCustomerByCompany {
    _id: String
    primaryPhone: String
    primaryEmail: String
  }
`;

const oneFitCustomerQueryParams = `
  searchValue: String
  phone: String
  email: String
  membershipPlanId: String
  membershipStatus: OneFitMembershipStatus
  minCreditBalance: Float
  maxCreditBalance: Float
  preferredActivityTypeId: String
  type: String
`;

export const queries = `
  oneFitCustomers(${oneFitCustomerQueryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitCustomerListResponse
  oneFitCustomer(_id: String!): Customer
  oneFitCustomersCount(${oneFitCustomerQueryParams}): Int
  oneFitCustomersByCompanyId(companyId: String!): [OneFitCustomerByCompany]
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

  oneFitMembershipHoldStart(userId: String!, holdDays: Int!): Customer
  oneFitMembershipHoldCancel(userId: String!): Customer
`;
