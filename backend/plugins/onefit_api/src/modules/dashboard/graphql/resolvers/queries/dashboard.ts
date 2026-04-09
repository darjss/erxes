import { Resolver } from 'erxes-api-shared/core-types';
import { getPureDate, markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { addInstanceIdFilter } from '~/utils/providerFilter';

interface OneFitDashboardMetricResult {
  value: number;
  previousValue: number | null;
  changePercent: number | null;
}

function buildMetric(
  value: number,
  previousValue: number | null,
): OneFitDashboardMetricResult {
  let changePercent: number | null = null;
  if (previousValue !== null && previousValue !== undefined) {
    if (previousValue === 0) {
      changePercent = value === 0 ? 0 : null;
    } else {
      changePercent = ((value - previousValue) / previousValue) * 100;
    }
  }
  return {
    value,
    previousValue:
      previousValue === null || previousValue === undefined
        ? null
        : previousValue,
    changePercent,
  };
}

function getBookingDateBounds(startDate: Date, endDate: Date) {
  const gte = getPureDate(startDate);
  const lte = new Date(getPureDate(endDate));
  lte.setHours(23, 59, 59, 999);
  return { gte, lte };
}

function getPreviousPeriodBounds(startDate: Date, endDate: Date) {
  const startCurrent = getPureDate(startDate);
  const endCurrent = new Date(getPureDate(endDate));
  endCurrent.setHours(23, 59, 59, 999);
  const lenMs = endCurrent.getTime() - startCurrent.getTime();
  const prevEnd = new Date(startCurrent.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - lenMs);
  return { startDate: prevStart, endDate: prevEnd };
}

async function buildBookingFilterForRange(
  context: IContext,
  startDate: Date,
  endDate: Date,
) {
  const { gte, lte } = getBookingDateBounds(startDate, endDate);
  const base: Record<string, unknown> = {
    bookingDate: { $gte: gte, $lte: lte },
  };
  return addInstanceIdFilter(context, base);
}

async function countDistinctBookingUsers(
  context: IContext,
  startDate: Date,
  endDate: Date,
): Promise<number> {
  const { models } = context;
  const filter = await buildBookingFilterForRange(context, startDate, endDate);
  const userIds = await models.Booking.distinct('userId', filter);
  return userIds.filter(Boolean).length;
}

async function countBookingsInRange(
  context: IContext,
  startDate: Date,
  endDate: Date,
): Promise<number> {
  const { models } = context;
  const filter = await buildBookingFilterForRange(context, startDate, endDate);
  return models.Booking.countDocuments(filter);
}

async function countNewOneFitCustomersInRange(
  context: IContext,
  startDate: Date,
  endDate: Date,
): Promise<number> {
  const { models } = context;
  const { gte, lte } = getBookingDateBounds(startDate, endDate);
  return models.OneFitCustomer.countDocuments({
    __t: 'OneFitCustomer',
    createdAt: { $gte: gte, $lte: lte },
  });
}

async function countTotalOneFitUsers(context: IContext): Promise<number> {
  const { models } = context;
  return models.OneFitCustomer.countDocuments({ __t: 'OneFitCustomer' });
}

async function countTotalOneFitUsersAsOf(
  context: IContext,
  asOfEnd: Date,
): Promise<number> {
  const { models } = context;
  const lte = new Date(getPureDate(asOfEnd));
  lte.setHours(23, 59, 59, 999);
  return models.OneFitCustomer.countDocuments({
    __t: 'OneFitCustomer',
    createdAt: { $lte: lte },
  });
}

export const dashboardQueries: Record<string, Resolver> = {
  async oneFitDashboardStats(
    _root: undefined,
    { startDate, endDate }: { startDate: Date; endDate: Date },
    context: IContext,
  ) {
    const prev = getPreviousPeriodBounds(startDate, endDate);

    const [
      totalNow,
      totalAsOfPrevEnd,
      activeCurrent,
      activePrev,
      newCurrent,
      newPrev,
      bookingsCurrent,
      bookingsPrev,
    ] = await Promise.all([
      countTotalOneFitUsers(context),
      countTotalOneFitUsersAsOf(context, prev.endDate),
      countDistinctBookingUsers(context, startDate, endDate),
      countDistinctBookingUsers(context, prev.startDate, prev.endDate),
      countNewOneFitCustomersInRange(context, startDate, endDate),
      countNewOneFitCustomersInRange(context, prev.startDate, prev.endDate),
      countBookingsInRange(context, startDate, endDate),
      countBookingsInRange(context, prev.startDate, prev.endDate),
    ]);

    const avgCurrent =
      activeCurrent > 0 ? bookingsCurrent / activeCurrent : 0;
    const avgPrev = activePrev > 0 ? bookingsPrev / activePrev : 0;

    // TODO: define B2B org count (contacts companies, relations, or credit companyId).
    return {
      totalOneFitUsers: buildMetric(totalNow, totalAsOfPrevEnd),
      activeUsersInPeriod: buildMetric(activeCurrent, activePrev),
      newUsersInPeriod: buildMetric(newCurrent, newPrev),
      b2bOrganizationsActive: buildMetric(0, 0),
      averageBookingsPerActiveUserInPeriod: buildMetric(avgCurrent, avgPrev),
    };
  },
};

markResolvers(dashboardQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
