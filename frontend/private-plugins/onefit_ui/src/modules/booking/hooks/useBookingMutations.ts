import { MutationFunctionOptions, useMutation } from '@apollo/client';
import { toast } from 'erxes-ui';
import {
  ONE_FIT_BOOKING_CREATE,
  ONE_FIT_BOOKING_CANCEL,
  ONE_FIT_BOOKING_MARK_ATTENDANCE,
} from '../graphql/bookingMutations';
import { ONE_FIT_BOOKINGS } from '../graphql/bookingQueries';
import { AttendanceStatus } from '../types/booking';

export function useCreateBooking() {
  const [createBookingMutation, { loading }] = useMutation(
    ONE_FIT_BOOKING_CREATE,
  );

  const createBooking = (options: MutationFunctionOptions) => {
    return createBookingMutation({
      ...options,
      refetchQueries: [{ query: ONE_FIT_BOOKINGS }],
      onCompleted: (data) => {
        options.onCompleted?.(data);
        toast({
          title: 'Success',
          description: 'Booking created successfully',
        });
      },
      onError: (error) => {
        options.onError?.(error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return { createBooking, loading };
}

export function useCancelBooking() {
  const [cancelBookingMutation, { loading }] = useMutation(
    ONE_FIT_BOOKING_CANCEL,
  );

  const cancelBooking = (options: MutationFunctionOptions) => {
    return cancelBookingMutation({
      ...options,
      refetchQueries: [{ query: ONE_FIT_BOOKINGS }],
      onCompleted: (data) => {
        options.onCompleted?.(data);
        toast({
          title: 'Success',
          description: 'Booking cancelled successfully',
        });
      },
      onError: (error) => {
        options.onError?.(error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return { cancelBooking, loading };
}

export function useMarkAttendance() {
  const [markAttendanceMutation, { loading }] = useMutation(
    ONE_FIT_BOOKING_MARK_ATTENDANCE,
  );

  const markAttendance = (
    bookingId: string,
    attendanceStatus: AttendanceStatus,
  ) => {
    return markAttendanceMutation({
      variables: {
        _id: bookingId,
        attendanceStatus,
      },
      refetchQueries: [{ query: ONE_FIT_BOOKINGS }],
      onCompleted: () => {
        toast({
          title: 'Success',
          description: 'Attendance marked successfully',
        });
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return { markAttendance, loading };
}

