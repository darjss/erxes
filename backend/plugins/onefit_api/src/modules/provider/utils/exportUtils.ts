import { getPureDate } from 'erxes-api-shared/utils';
import { IModels } from '~/connectionResolvers';
import { BookingStatus } from '@/booking/@types/booking';
import { getLocalizedString } from '@/activity-type/utils/localization';

export async function generateCSVExport(
  models: IModels,
  providerId: string,
  startDate?: Date,
  endDate?: Date,
): Promise<string> {
  const filter: any = { providerId };

  if (startDate || endDate) {
    filter.bookingDate = {};
    if (startDate) {
      filter.bookingDate.$gte = getPureDate(startDate);
    }
    if (endDate) {
      const endDatePure = getPureDate(endDate);
      endDatePure.setHours(23, 59, 59, 999);
      filter.bookingDate.$lte = endDatePure;
    }
  }

  const bookings = await models.Booking.find(filter)
    .sort({ bookingDate: -1 })
    .lean();

  // Get activity types for names
  const activityTypeIds = [...new Set(bookings.map((b) => b.activityTypeId))];
  const activityTypes = await models.ActivityType.find({
    _id: { $in: activityTypeIds },
  }).lean();

  const activityTypeMap = new Map(
    activityTypes.map((at) => [
      at._id,
      getLocalizedString(at.name as any, 'en'),
    ]),
  );

  // CSV headers
  const headers = [
    'Booking ID',
    'Customer ID',
    'Activity Type',
    'Booking Date',
    'Start Time',
    'End Time',
    'Status',
    'Attendance Status',
    'Credit Cost',
    'Created At',
  ];

  // CSV rows
  const rows = bookings.map((booking) => {
    const activityTypeName =
      activityTypeMap.get(booking.activityTypeId) || 'Unknown';
    return [
      booking.bookingId,
      booking.userId,
      activityTypeName,
      booking.bookingDate.toISOString().split('T')[0],
      booking.startTime,
      booking.endTime,
      booking.status,
      booking.attendanceStatus,
      booking.creditCost.toString(),
      booking.createdAt.toISOString(),
    ].map((field) => `"${String(field).replace(/"/g, '""')}"`);
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
}

export async function generatePDFExport(
  models: IModels,
  providerId: string,
  startDate?: Date,
  endDate?: Date,
): Promise<string> {
  // This would use the document system to generate PDF
  // For now, return a placeholder
  const csvData = await generateCSVExport(
    models,
    providerId,
    startDate,
    endDate,
  );

  // In a real implementation, this would convert CSV to PDF using a library
  // or use the existing document system
  return `PDF export for provider ${providerId} - ${csvData.length} bytes of data`;
}
