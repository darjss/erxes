import { Resolver } from 'erxes-api-shared/core-types';
import { getPureDate, markResolvers } from 'erxes-api-shared/utils';
import { MembershipPurchaseStatus } from '@/membership/@types/membershippurchase';
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

interface IActiveCustomerProjection {
  _id: string;
  membershipPlanId?: string;
  currentCreditBalance?: number;
}

interface IMembershipPlanProjection {
  _id: string;
  name?: string;
  creditAmount?: number;
}

interface OneFitDashboardPackageStat {
  planId: string;
  planName: string;
  activeCustomerCount: number;
  totalCredit: number;
  consumedCredit: number;
  checkInCount: number;
  usagePercent: number;
}

interface OneFitDashboardB2bB2cSales {
  b2bCount: number;
  b2cCount: number;
  b2bPercent: number;
  b2cPercent: number;
}

interface IPromoCodeProjection {
  _id: string;
  isCompanyTag?: boolean;
}

interface IPurchaseProjection {
  _id: string;
  promoCodeId?: string;
}

interface IPurchaseProjectionWithDates extends IPurchaseProjection {
  paidAt?: Date;
  purchasedAt?: Date;
}

interface OneFitDashboardUserGrowthMonth {
  monthKey: string;
  b2bUsers: number;
  b2cUsers: number;
  newUsers: number;
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

function getMonthKeysOverlappingRange(startDate: Date, endDate: Date): string[] {
  const start = getPureDate(startDate);
  const end = getPureDate(endDate);
  if (start.getTime() > end.getTime()) {
    return [];
  }
  const keys: string[] = [];
  let y = start.getUTCFullYear();
  let m = start.getUTCMonth();
  const endY = end.getUTCFullYear();
  const endM = end.getUTCMonth();

  while (y < endY || (y === endY && m <= endM)) {
    keys.push(`${y}-${String(m + 1).padStart(2, '0')}`);
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }

  return keys;
}

function formatMonthKeyUtc(date: Date): string {
  const y = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  return `${y}-${String(month).padStart(2, '0')}`;
}

function getEffectivePurchaseDate(
  purchase: IPurchaseProjectionWithDates,
): Date | null {
  if (purchase.paidAt) {
    return new Date(purchase.paidAt);
  }
  if (purchase.purchasedAt) {
    return new Date(purchase.purchasedAt);
  }
  return null;
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

  while (
    parentId &&
    parentByCategoryId.has(parentId) &&
    !visited.has(parentId)
  ) {
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
      stat.parentId && statsById.has(stat.parentId)
        ? stat.parentId
        : '__root__';
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
  const bookings = await models.Booking.find(filter, {
    activityTypeId: 1,
  }).lean();

  const activityTypeIds = [
    ...new Set(
      bookings
        .map((booking) => booking.activityTypeId)
        .filter((activityTypeId): activityTypeId is string =>
          Boolean(activityTypeId),
        ),
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
    activityTypes.map((activityType) => [
      String(activityType._id),
      activityType,
    ]),
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

    leafCategoryCountById.set(
      categoryId,
      (leafCategoryCountById.get(categoryId) || 0) + count,
    );
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
    categories.map((category) => [
      String(category._id),
      getCategoryLabel(category.name),
    ]),
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

async function getPackageStats(
  context: IContext,
  startDate: Date,
  endDate: Date,
): Promise<OneFitDashboardPackageStat[]> {
  const { models } = context;

  const activeCustomers = (await models.OneFitCustomer.find(
    {
      __t: 'OneFitCustomer',
      membershipStatus: 'active',
      membershipPlanId: { $exists: true, $ne: '' },
    },
    {
      _id: 1,
      membershipPlanId: 1,
      currentCreditBalance: 1,
    },
  ).lean()) as IActiveCustomerProjection[];

  if (!activeCustomers.length) {
    return [];
  }

  const customerById = new Map<string, IActiveCustomerProjection>();
  const customerIds: string[] = [];
  const planSummaryById = new Map<
    string,
    { activeCustomerCount: number; currentCreditTotal: number }
  >();

  for (const customer of activeCustomers) {
    if (!customer.membershipPlanId) {
      continue;
    }

    const customerId = String(customer._id);
    customerIds.push(customerId);
    customerById.set(customerId, customer);

    const summary = planSummaryById.get(customer.membershipPlanId) || {
      activeCustomerCount: 0,
      currentCreditTotal: 0,
    };

    summary.activeCustomerCount += 1;
    summary.currentCreditTotal += customer.currentCreditBalance || 0;

    planSummaryById.set(customer.membershipPlanId, summary);
  }

  const planIds = Array.from(planSummaryById.keys());
  if (!planIds.length) {
    return [];
  }

  const plans = (await models.MembershipPlan.find(
    { _id: { $in: planIds } },
    { _id: 1, name: 1, creditAmount: 1 },
  ).lean()) as IMembershipPlanProjection[];
  const planById = new Map(plans.map((plan) => [String(plan._id), plan]));

  const bookingFilter = await buildBookingFilterForRange(
    context,
    startDate,
    endDate,
  );
  const bookingsByUser = await models.Booking.aggregate([
    {
      $match: {
        ...bookingFilter,
        userId: { $in: customerIds },
      },
    },
    {
      $group: {
        _id: '$userId',
        count: { $sum: 1 },
      },
    },
  ]);

  const checkInsByPlanId = new Map<string, number>();
  for (const item of bookingsByUser) {
    const userId = String(item._id);
    const user = customerById.get(userId);
    if (!user?.membershipPlanId) {
      continue;
    }

    checkInsByPlanId.set(
      user.membershipPlanId,
      (checkInsByPlanId.get(user.membershipPlanId) || 0) + (item.count || 0),
    );
  }

  const packageStats = planIds
    .map((planId) => {
      const plan = planById.get(planId);
      const planCreditAmount = plan?.creditAmount || 0;
      const activeSummary = planSummaryById.get(planId) || {
        activeCustomerCount: 0,
        currentCreditTotal: 0,
      };

      const totalCredit = activeSummary.activeCustomerCount * planCreditAmount;
      const consumedCredit = Math.max(
        totalCredit - activeSummary.currentCreditTotal,
        0,
      );
      const usagePercent =
        totalCredit > 0 ? (consumedCredit / totalCredit) * 100 : 0;

      return {
        planId,
        planName: plan?.name || 'Unknown plan',
        activeCustomerCount: activeSummary.activeCustomerCount,
        totalCredit,
        consumedCredit,
        checkInCount: checkInsByPlanId.get(planId) || 0,
        usagePercent,
      };
    })
    .sort((left, right) => right.totalCredit - left.totalCredit);

  return packageStats;
}

async function getB2bB2cSalesCounts(
  context: IContext,
  startDate: Date,
  endDate: Date,
): Promise<OneFitDashboardB2bB2cSales> {
  const { models } = context;
  const { gte, lte } = getBookingDateBounds(startDate, endDate);

  const purchases = (await models.MembershipPurchase.find(
    {
      status: MembershipPurchaseStatus.PAID,
      $or: [
        { paidAt: { $gte: gte, $lte: lte } },
        {
          paidAt: { $exists: false },
          purchasedAt: { $gte: gte, $lte: lte },
        },
        {
          paidAt: null,
          purchasedAt: { $gte: gte, $lte: lte },
        },
      ],
    },
    { _id: 1, promoCodeId: 1 },
  ).lean()) as IPurchaseProjection[];

  if (!purchases.length) {
    return {
      b2bCount: 0,
      b2cCount: 0,
      b2bPercent: 0,
      b2cPercent: 0,
    };
  }

  const promoCodeIds = [
    ...new Set(
      purchases
        .map((purchase) => purchase.promoCodeId)
        .filter((promoCodeId): promoCodeId is string => Boolean(promoCodeId)),
    ),
  ];

  const promoCodes = promoCodeIds.length
    ? ((await models.PromoCode.find(
        { _id: { $in: promoCodeIds } },
        { _id: 1, isCompanyTag: 1 },
      ).lean()) as IPromoCodeProjection[])
    : [];

  const companyTagByPromoCodeId = new Map(
    promoCodes.map((promoCode) => [
      String(promoCode._id),
      !!promoCode.isCompanyTag,
    ]),
  );

  let b2bCount = 0;
  for (const purchase of purchases) {
    if (!purchase.promoCodeId) {
      continue;
    }

    if (companyTagByPromoCodeId.get(String(purchase.promoCodeId))) {
      b2bCount += 1;
    }
  }

  const total = purchases.length;
  const b2cCount = Math.max(total - b2bCount, 0);

  return {
    b2bCount,
    b2cCount,
    b2bPercent: total > 0 ? (b2bCount / total) * 100 : 0,
    b2cPercent: total > 0 ? (b2cCount / total) * 100 : 0,
  };
}

async function getUserGrowthByMonth(
  context: IContext,
  startDate: Date,
  endDate: Date,
): Promise<OneFitDashboardUserGrowthMonth[]> {
  const { models } = context;
  const { gte, lte } = getBookingDateBounds(startDate, endDate);
  const monthKeys = getMonthKeysOverlappingRange(startDate, endDate);

  const countsByMonth = new Map<
    string,
    { b2bUsers: number; b2cUsers: number; newUsers: number }
  >();

  for (const key of monthKeys) {
    countsByMonth.set(key, { b2bUsers: 0, b2cUsers: 0, newUsers: 0 });
  }

  const newUserAgg = await models.OneFitCustomer.aggregate([
    {
      $match: {
        __t: 'OneFitCustomer',
        createdAt: { $gte: gte, $lte: lte },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m', date: '$createdAt', timezone: 'UTC' },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  for (const row of newUserAgg) {
    const key = row._id as string;
    if (!countsByMonth.has(key)) {
      continue;
    }
    const entry = countsByMonth.get(key)!;
    entry.newUsers = row.count;
  }

  const purchases = (await models.MembershipPurchase.find(
    {
      status: MembershipPurchaseStatus.PAID,
      $or: [
        { paidAt: { $gte: gte, $lte: lte } },
        {
          paidAt: { $exists: false },
          purchasedAt: { $gte: gte, $lte: lte },
        },
        {
          paidAt: null,
          purchasedAt: { $gte: gte, $lte: lte },
        },
      ],
    },
    { _id: 1, promoCodeId: 1, paidAt: 1, purchasedAt: 1 },
  ).lean()) as IPurchaseProjectionWithDates[];

  const promoCodeIds = [
    ...new Set(
      purchases
        .map((purchase) => purchase.promoCodeId)
        .filter((promoCodeId): promoCodeId is string => Boolean(promoCodeId)),
    ),
  ];

  const promoCodes = promoCodeIds.length
    ? ((await models.PromoCode.find(
        { _id: { $in: promoCodeIds } },
        { _id: 1, isCompanyTag: 1 },
      ).lean()) as IPromoCodeProjection[])
    : [];

  const companyTagByPromoCodeId = new Map(
    promoCodes.map((promoCode) => [
      String(promoCode._id),
      !!promoCode.isCompanyTag,
    ]),
  );

  for (const purchase of purchases) {
    const effectiveDate = getEffectivePurchaseDate(purchase);
    if (!effectiveDate) {
      continue;
    }
    const key = formatMonthKeyUtc(effectiveDate);
    if (!countsByMonth.has(key)) {
      continue;
    }
    const entry = countsByMonth.get(key)!;
    if (
      purchase.promoCodeId &&
      companyTagByPromoCodeId.get(String(purchase.promoCodeId))
    ) {
      entry.b2bUsers += 1;
    } else {
      entry.b2cUsers += 1;
    }
  }

  return monthKeys.map((monthKey) => {
    const bucket = countsByMonth.get(monthKey)!;
    return {
      monthKey,
      b2bUsers: bucket.b2bUsers,
      b2cUsers: bucket.b2cUsers,
      newUsers: bucket.newUsers,
    };
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
      categoryDistribution,
      packageStats,
      b2bB2cSales,
      userGrowthByMonth,
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
      getPackageStats(context, startDate, endDate),
      getB2bB2cSalesCounts(context, startDate, endDate),
      getUserGrowthByMonth(context, startDate, endDate),
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
      b2bB2cSales,
      userGrowthByMonth,
      categoryDistribution,
      packageStats,
    };
  },
};

markResolvers(dashboardQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
