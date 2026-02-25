import { Resolver } from 'erxes-api-shared/core-types';
import { getPureDate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { BookingStatus } from '@/booking/@types/booking';
import { addInstanceIdFilter } from '~/utils/providerFilter';

export const accountStatementQueries: Record<string, Resolver> = {
  async oneFitAccountStatement(
    _root: undefined,
    params: {
      providerId?: string;
      startDate: Date;
      endDate: Date;
    },
    context: IContext,
  ) {
    const { models } = context;
    const { providerId, startDate, endDate } = params;

    const filter: any = {
      status: { $in: [BookingStatus.COMPLETED, BookingStatus.NO_SHOW] },
      bookingDate: {
        $gte: getPureDate(startDate),
        $lte: (() => {
          const end = new Date(getPureDate(endDate));
          end.setHours(23, 59, 59, 999);
          return end;
        })(),
      },
    };

    if (providerId) {
      filter.providerId = providerId;
    }

    const resolvedFilter = await addInstanceIdFilter(context, filter);

    const aggregated = await models.Booking.aggregate([
      { $match: resolvedFilter },
      {
        $group: {
          _id: {
            year: { $year: '$bookingDate' },
            month: { $month: '$bookingDate' },
            providerId: '$providerId',
          },
          creditsEarnedCompleted: {
            $sum: {
              $cond: [
                { $eq: ['$status', BookingStatus.COMPLETED] },
                '$creditCost',
                0,
              ],
            },
          },
          creditsEarnedNoShow: {
            $sum: {
              $cond: [
                { $eq: ['$status', BookingStatus.NO_SHOW] },
                '$creditCost',
                0,
              ],
            },
          },
          bookingCountCompleted: {
            $sum: {
              $cond: [
                { $eq: ['$status', BookingStatus.COMPLETED] },
                1,
                0,
              ],
            },
          },
          bookingCountNoShow: {
            $sum: {
              $cond: [
                { $eq: ['$status', BookingStatus.NO_SHOW] },
                1,
                0,
              ],
            },
          },
          amountEarnedCompleted: {
            $sum: {
              $cond: [
                { $eq: ['$status', BookingStatus.COMPLETED] },
                { $ifNull: ['$price', 0] },
                0,
              ],
            },
          },
          amountEarnedNoShow: {
            $sum: {
              $cond: [
                { $eq: ['$status', BookingStatus.NO_SHOW] },
                { $ifNull: ['$price', 0] },
                0,
              ],
            },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.providerId': 1 } },
    ]);

    const providerIds = [
      ...new Set(aggregated.map((a: any) => a._id.providerId)),
    ];
    const providers =
      providerIds.length > 0
        ? await models.Provider.find({ _id: { $in: providerIds } }).lean()
        : [];
    const providerMap = new Map(providers.map((p: any) => [p._id, p]));

    const rows = aggregated.map((a: any) => ({
      year: a._id.year,
      month: a._id.month,
      providerId: a._id.providerId,
      provider: providerMap.get(a._id.providerId) ?? null,
      creditsEarnedCompleted: a.creditsEarnedCompleted,
      creditsEarnedNoShow: a.creditsEarnedNoShow,
      bookingCountCompleted: a.bookingCountCompleted,
      bookingCountNoShow: a.bookingCountNoShow,
      amountEarnedCompleted: a.amountEarnedCompleted,
      amountEarnedNoShow: a.amountEarnedNoShow,
    }));

    const totalCreditsEarned = rows.reduce(
      (sum: number, r: any) =>
        sum + r.creditsEarnedCompleted + r.creditsEarnedNoShow,
      0,
    );

    const totalAmountEarned = rows.reduce(
      (sum: number, r: any) =>
        sum + r.amountEarnedCompleted + r.amountEarnedNoShow,
      0,
    );

    return { rows, totalCreditsEarned, totalAmountEarned };
  },
};
