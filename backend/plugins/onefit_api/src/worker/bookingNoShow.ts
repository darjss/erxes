import { getPureDate } from 'erxes-api-shared/utils';
import { BookingStatus, AttendanceStatus } from '@/booking/@types/booking';
import { IModels } from '~/connectionResolvers';

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const LOOKBACK_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function getSlotEnd(bookingDate: Date, endTime: string): Date {
  const datePure = getPureDate(bookingDate);
  const [hours, minutes] = endTime.split(':').map(Number);
  const slotEnd = new Date(datePure);
  slotEnd.setHours(hours, minutes ?? 0, 0, 0);
  return slotEnd;
}

export async function processBookingNoShow(
  models: IModels,
  _subdomain: string,
): Promise<void> {
  const now = new Date();
  const cutoff = new Date(now.getTime() - TWENTY_FOUR_HOURS_MS);
  const lookbackStart = new Date(now.getTime() - LOOKBACK_DAYS_MS);

  const candidates = await models.Booking.find({
    status: BookingStatus.CONFIRMED,
    attendanceStatus: AttendanceStatus.PENDING,
    bookingDate: {
      $gte: getPureDate(lookbackStart),
      $lte: getPureDate(cutoff),
    },
  }).lean();
  console.log('candidates', candidates.length);
  for (const booking of candidates) {
    const slotEnd = getSlotEnd(booking.bookingDate, booking.endTime);
    if (slotEnd < cutoff) {
      await models.Booking.markAttendance(
        booking._id,
        AttendanceStatus.NO_SHOW,
        'system',
      );
    }
  }
}
