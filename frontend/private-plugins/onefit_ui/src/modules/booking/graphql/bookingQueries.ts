import { gql } from '@apollo/client';
import { GQL_CURSOR_PARAM_DEFS, GQL_CURSOR_PARAMS } from 'erxes-ui';

export const ONE_FIT_BOOKINGS = gql`
  query OneFitBookings(
    $userId: String
    $providerId: String
    $activityTypeId: String
    $bookingDate: Date
    $status: OneFitBookingStatus
    $attendanceStatus: OneFitAttendanceStatus
    ${GQL_CURSOR_PARAM_DEFS}
  ) {
    oneFitBookings(
      userId: $userId
      providerId: $providerId
      activityTypeId: $activityTypeId
      bookingDate: $bookingDate
      status: $status
      attendanceStatus: $attendanceStatus
      ${GQL_CURSOR_PARAMS}
    ) {
      list {
        _id
        createdAt
        modifiedAt
        userId
        providerId
        activityTypeId
        user {
          _id
          firstName
          lastName
          primaryEmail
          primaryPhone
        }
        provider {
          _id
          businessName {
            en
            mn
          }
        }
        activityType {
          _id
          name {
            en
            mn
          }
        }
        bookingDate
        startTime
        endTime
        creditCost
        status
        attendanceStatus
        bookingId
        cancelledAt
        cancelledBy
        cancellationReason
        attendedAt
        markedBy
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const ONE_FIT_BOOKINGS_COUNT = gql`
  query OneFitBookingsCount(
    $userId: String
    $providerId: String
    $activityTypeId: String
    $bookingDate: Date
    $status: OneFitBookingStatus
    $attendanceStatus: OneFitAttendanceStatus
  ) {
    oneFitBookingsCount(
      userId: $userId
      providerId: $providerId
      activityTypeId: $activityTypeId
      bookingDate: $bookingDate
      status: $status
      attendanceStatus: $attendanceStatus
    )
  }
`;

export const ONE_FIT_BOOKING = gql`
  query OneFitBooking($_id: String!) {
    oneFitBooking(_id: $_id) {
      _id
      createdAt
      modifiedAt
      userId
      providerId
      activityTypeId
      bookingDate
      startTime
      endTime
      creditCost
      status
      attendanceStatus
      bookingId
      cancelledAt
      cancelledBy
      cancellationReason
      attendedAt
      markedBy
    }
  }
`;

export const ONE_FIT_BOOKING_BY_BOOKING_ID = gql`
  query OneFitBookingByBookingId($bookingId: String!) {
    oneFitBookingByBookingId(bookingId: $bookingId) {
      _id
      createdAt
      modifiedAt
      userId
      providerId
      activityTypeId
      user {
        _id
        firstName
        lastName
        primaryEmail
        primaryPhone
      }
      provider {
        _id
        businessName {
          en
          mn
        }
      }
      activityType {
        _id
        name {
          en
          mn
        }
      }
      bookingDate
      startTime
      endTime
      creditCost
      status
      attendanceStatus
      bookingId
      cancelledAt
      cancelledBy
      cancellationReason
      attendedAt
      markedBy
    }
  }
`;
