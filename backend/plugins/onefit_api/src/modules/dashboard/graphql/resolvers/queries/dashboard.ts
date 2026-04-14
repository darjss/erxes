import { Resolver } from 'erxes-api-shared/core-types';
import { getPureDate, markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { addInstanceIdFilter } from '~/utils/providerFilter';

interface OneFitDashboardMetricResult {
  value: number;
  previousValue: number | null;
  changePercent: number | null;
}

interface ILocalizedLabel {
  en?: string;
  mn?: string;
}

interface IActivityTypeCategoryProjection {
  _id: string;
  categoryIds?: string[];
}

interface ICategoryLabelProjection {
  _id: string;
  name?: ILocalizedLabel;
  parentId?: string;
}

interface OneFitDashboardCategoryStat {
  categoryId: string;
  label: string;
  parentId?: string;
  depth: number;
  count: number;
  percent: number;
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

function getCategoryLabel(name?: ILocalizedLabel): string {
  return name?.mn || name?.en || 'Unknown';
}

function buildCategoryDepth(
  categoryId: string,
  parentByCategoryId: Map<string, string | undefined>,
): number {
  let depth = 0;
  let parentId = parentByCategoryId.get(categoryId);
  const visited = new Set<string>([categoryId]);

  while (parentId && parentByCategoryId.has(parentId) && !visited.has(parentId)) {
    depth += 1;
    visited.add(parentId);
    parentId = parentByCategoryId.get(parentId);
  }

  return depth;
}

function buildHierarchicalCategoryStats(
  stats: OneFitDashboardCategoryStat[],
): OneFitDashboardCategoryStat[] {
  if (!stats.length) {
    return [];
  }

  const statsByParentId = new Map<string, OneFitDashboardCategoryStat[]>();
  const statsById = new Map(stats.map((stat) => [stat.categoryId, stat]));

  for (const stat of stats) {
    const parentId =
      stat.parentId && statsById.has(stat.parentId) ? stat.parentId : '__root__';
    const siblings = statsByParentId.get(parentId) || [];
    siblings.push(stat);
    statsByParentId.set(parentId, siblings);
  }

  for (const siblings of statsByParentId.values()) {
    siblings.sort((left, right) => right.count - left.count);
  }

  const ordered: OneFitDashboardCategoryStat[] = [];

  function appendChildren(parentId: string, depth: number) {
    const children = statsByParentId.get(parentId) || [];

    for (const child of children) {
      ordered.push({ ...child, depth });
      appendChildren(child.categoryId, depth + 1);
    }
  }

  appendChildren('__root__', 0);

  return ordered;
}

async function getCategoryDistribution(
  context: IContext,
  startDate: Date,
  endDate: Date,
): Promise<OneFitDashboardCategoryStat[]> {
  const { models } = context;
  const filter = await buildBookingFilterForRange(context, startDate, endDate);
  const bookings = await models.Booking.find(filter, { activityTypeId: 1 }).lean();

  const activityTypeIds = [
    ...new Set(
      bookings
        .map((booking) => booking.activityTypeId)
        .filter((activityTypeId): activityTypeId is string => Boolean(activityTypeId)),
    ),
  ];

  if (!activityTypeIds.length) {
    return [];
  }

  const activityTypes = (await models.ActivityType.find(
    { _id: { $in: activityTypeIds } },
    { _id: 1, categoryIds: 1 },
  ).lean()) as IActivityTypeCategoryProjection[];

  const activityTypeById = new Map(
    activityTypes.map((activityType) => [String(activityType._id), activityType]),
  );

  const categoryCountById = new Map<string, number>();

  for (const booking of bookings) {
    const activityType = activityTypeById.get(String(booking.activityTypeId));

    if (!activityType?.categoryIds?.length) {
      continue;
    }

    for (const categoryId of activityType.categoryIds) {
      if (!categoryId) {
        continue;
      }

      const previousCount = categoryCountById.get(categoryId) || 0;
      categoryCountById.set(categoryId, previousCount + 1);
    }
  }

  if (!categoryCountById.size) {
    return [];
  }

  const categories = (await models.ActivityCategory.find(
    {},
    { _id: 1, name: 1, parentId: 1 },
  ).lean()) as ICategoryLabelProjection[];

  const categoryById = new Map(
    categories.map((category) => [String(category._id), category]),
  );
  const childrenByParentId = new Map<string, string[]>();

  for (const category of categories) {
    if (!category.parentId) {
      continue;
    }

    const siblings = childrenByParentId.get(category.parentId) || [];
    siblings.push(String(category._id));
    childrenByParentId.set(category.parentId, siblings);
  }

  const leafCategoryIds = new Set(
    categories
      .map((category) => String(category._id))
      .filter((categoryId) => !childrenByParentId.has(categoryId)),
  );

  // Count only leaf categories first, then roll values up to parents.
  const leafCategoryCountById = new Map<string, number>();
  for (const [categoryId, count] of categoryCountById.entries()) {
    if (!leafCategoryIds.has(categoryId)) {
      continue;
    }

    leafCategoryCountById.set(categoryId, (leafCategoryCountById.get(categoryId) || 0) + count);
  }

  if (!leafCategoryCountById.size) {
    return [];
  }

  const aggregatedCategoryCountById = new Map<string, number>();
  for (const [leafCategoryId, count] of leafCategoryCountById.entries()) {
    aggregatedCategoryCountById.set(
      leafCategoryId,
      (aggregatedCategoryCountById.get(leafCategoryId) || 0) + count,
    );

    let currentParentId = categoryById.get(leafCategoryId)?.parentId;
    const visited = new Set<string>([leafCategoryId]);

    while (currentParentId && !visited.has(currentParentId)) {
      aggregatedCategoryCountById.set(
        currentParentId,
        (aggregatedCategoryCountById.get(currentParentId) || 0) + count,
      );
      visited.add(currentParentId);
      currentParentId = categoryById.get(currentParentId)?.parentId;
    }
  }

  const categoryIds = Array.from(aggregatedCategoryCountById.keys());
  const categoryLabelById = new Map(
    categories.map((category) => [String(category._id), getCategoryLabel(category.name)]),
  );
  const parentByCategoryId = new Map(
    categories.map((category) => [String(category._id), category.parentId]),
  );

  const total = Array.from(leafCategoryCountById.values()).reduce(
    (sum, count) => sum + count,
    0,
  );

  const categoryStats = categoryIds
    .map((categoryId) => {
      const count = aggregatedCategoryCountById.get(categoryId) || 0;
      const percent = total > 0 ? (count / total) * 100 : 0;
      const parentId = parentByCategoryId.get(categoryId);
      const depth = buildCategoryDepth(categoryId, parentByCategoryId);

      return {
        categoryId,
        label: categoryLabelById.get(categoryId) || 'Unknown',
        parentId,
        depth,
        count,
        percent,
      };
    })
    .sort((left, right) => right.count - left.count);

  return buildHierarchicalCategoryStats(categoryStats);
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
      categoryDistribution,
    ] = await Promise.all([
      countTotalOneFitUsers(context),
      countTotalOneFitUsersAsOf(context, prev.endDate),
      countDistinctBookingUsers(context, startDate, endDate),
      countDistinctBookingUsers(context, prev.startDate, prev.endDate),
      countNewOneFitCustomersInRange(context, startDate, endDate),
      countNewOneFitCustomersInRange(context, prev.startDate, prev.endDate),
      countBookingsInRange(context, startDate, endDate),
      countBookingsInRange(context, prev.startDate, prev.endDate),
      getCategoryDistribution(context, startDate, endDate),
    ]);

    const avgCurrent = activeCurrent > 0 ? bookingsCurrent / activeCurrent : 0;
    const avgPrev = activePrev > 0 ? bookingsPrev / activePrev : 0;

    // TODO: define B2B org count (contacts companies, relations, or credit companyId).
    return {
      totalOneFitUsers: buildMetric(totalNow, totalAsOfPrevEnd),
      activeUsersInPeriod: buildMetric(activeCurrent, activePrev),
      newUsersInPeriod: buildMetric(newCurrent, newPrev),
      b2bOrganizationsActive: buildMetric(0, 0),
      averageBookingsPerActiveUserInPeriod: buildMetric(avgCurrent, avgPrev),
      categoryDistribution,
    };
  },
};

markResolvers(dashboardQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
