export const types = `
  enum OneFitBookingStatus {
    confirmed
    cancelled
    completed
    no_show
  }

  enum OneFitAttendanceStatus {
    pending
    attended
    no_show
  }

  type OneFitBooking {
    _id: String
    createdAt: Date
    modifiedAt: Date
    userId: String
    providerId: String
    activityTypeId: String
    user: Customer
    provider: OneFitProvider
    activityType: OneFitActivityType
    bookingDate: Date
    startTime: String
    endTime: String
    creditCost: Float
    status: OneFitBookingStatus
    attendanceStatus: OneFitAttendanceStatus
    bookingId: String
    cancelledAt: Date
    cancelledBy: String
    cancellationReason: String
    attendedAt: Date
    markedBy: String
  }

  type OneFitBookingListResponse {
    list: [OneFitBooking]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const bookingQueryParams = `
  userId: String,
  providerId: String,
  activityTypeId: String,
  bookingDate: Date,
  status: OneFitBookingStatus,
  attendanceStatus: OneFitAttendanceStatus,
`;

const cpBookingQueryParams = `
  providerId: String,
  activityTypeId: String,
  bookingDate: Date,
  status: OneFitBookingStatus,
  attendanceStatus: OneFitAttendanceStatus,
`;

import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const queries = `
  oneFitBookings(${bookingQueryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitBookingListResponse
  oneFitBookingsCount(${bookingQueryParams}): Int
  oneFitBooking(_id: String): OneFitBooking
  oneFitBookingByBookingId(bookingId: String!): OneFitBooking
  cpOneFitBookings(${cpBookingQueryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitBookingListResponse
  cpOneFitBookingsCount(${cpBookingQueryParams}): Int
  cpOneFitBooking(_id: String!): OneFitBooking
  cpOneFitBookingByBookingId(bookingId: String!): OneFitBooking
`;

const bookingInput = `
  userId: String!
  activityTypeId: String!
  bookingDate: Date!
  startTime: String!
  endTime: String!
`;

const cpBookingInput = `
  activityTypeId: String!
  bookingDate: Date!
  startTime: String!
  endTime: String!
`;

const cancelBookingInput = `
  _id: String!
  reason: String
`;

const markAttendanceInput = `
  _id: String!
  attendanceStatus: OneFitAttendanceStatus!
`;

export const mutations = `
  oneFitBookingCreate(${bookingInput}): OneFitBooking
  oneFitBookingCancel(${cancelBookingInput}): OneFitBooking
  oneFitBookingMarkAttendance(${markAttendanceInput}): OneFitBooking
  oneFitBookingsRemove(ids: [String]!): JSON
  cpOneFitBookingCreate(${cpBookingInput}): OneFitBooking
  cpOneFitBookingCancel(${cancelBookingInput}): OneFitBooking
`;
