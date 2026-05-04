import { Resolver } from 'erxes-api-shared/core-types';
import {
  getPureDate,
  markResolvers,
  sendTRPCMessage,
} from 'erxes-api-shared/utils';
import { BookingStatus } from '@/booking/@types/booking';
import { CreditTransactionType } from '@/membership/@types/credittransaction';
import { MembershipPurchaseStatus } from '@/membership/@types/membershippurchase';
import { IContext } from '~/connectionResolvers';
import { addInstanceIdFilter } from '~/utils/providerFilter';
import { ifTeamUserCheck } from '~/utils/onefitPermissionCheck';

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
  firstName?: string;
  lastName?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  membershipPlanId?: string;
  currentCreditBalance?: number;
}

interface IMembershipPlanProjection {
  _id: string;
  name?: string;
  creditAmount?: number;
}

interface ICoreCompanyProjection {
  _id: string;
  primaryName?: string;
  names?: string[];
  name?: string;
}

interface OneFitDashboardPackageStat {
  planId: string;
  planName: string;
  activeCustomerCount: number;
  currentCreditTotal: number;
  totalCredit: number;
  consumedCredit: number;
  checkInCount: {
    attended: number;
    noShow: number;
    cancelled: number;
  };
  usagePercent: number;
}

interface OneFitDashboardCompanyUserStat {
  companyId: string;
  companyName: string;
  userId: string;
  userName: string;
  userPhone: string;
  planId: string;
  planName: string;
  lastPurchaseDate: Date | null;
  planCredit: number;
  creditBeforeLastPurchase: number;
  lastExpirationCredit: number;
  currentCredit: number;
  usedCredit: number;
}

interface ILatestPurchaseCreditTransactionProjection {
  userId: string;
  amount?: number;
  balanceAfter?: number;
  createdAt?: Date;
}

interface IUsageCreditTransactionProjection {
  userId: string;
  amount?: number;
  transactionType?: CreditTransactionType;
  createdAt?: Date;
}

interface OneFitDashboardB2bB2cSales {
  b2bCount: number;
  b2cCount: number;
  b2bPercent: number;
  b2cPercent: number;
}

interface IPurchaseProjection {
  _id: string;
  companyId?: string;
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

interface OneFitDashboardBookingStatusDay {
  dayKey: string;
  bookings: number;
  completed: number;
  noShow: number;
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

function getMonthKeysOverlappingRange(
  startDate: Date,
  endDate: Date,
): string[] {
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

function formatDayKeyUtc(date: Date): string {
  const y = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${y}-${String(month).padStart(2, '0')}-${String(day).padStart(
    2,
    '0',
  )}`;
}

function getDayKeysOverlappingRange(startDate: Date, endDate: Date): string[] {
  const start = getPureDate(startDate);
  const end = getPureDate(endDate);

  if (start.getTime() > end.getTime()) {
    return [];
  }

  const keys: string[] = [];
  const current = new Date(start);

  while (current.getTime() <= end.getTime()) {
    keys.push(formatDayKeyUtc(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return keys;
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
  planId?: string,
): Promise<OneFitDashboardCategoryStat[]> {
  const { models } = context;
  const filter = await buildBookingFilterForRange(context, startDate, endDate);

  if (planId) {
    const planCustomerIds = await models.OneFitCustomer.distinct('_id', {
      __t: 'OneFitCustomer',
      membershipPlanId: planId,
    });

    if (!planCustomerIds.length) {
      return [];
    }

    filter.userId = {
      $in: planCustomerIds.map((customerId) => String(customerId)),
    };
  }

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
  const bookingsByUserByStatus = await models.Booking.aggregate([
    {
      $match: {
        ...bookingFilter,
        userId: { $in: customerIds },
        status: {
          $in: [
            BookingStatus.COMPLETED,
            BookingStatus.NO_SHOW,
            BookingStatus.CANCELLED,
          ],
        },
      },
    },
    {
      $group: {
        _id: { userId: '$userId', status: '$status' },
        count: { $sum: 1 },
        consumedCredit: { $sum: '$creditCost' },
      },
    },
  ]);

  const checkInsByPlanId = new Map<
    string,
    { attended: number; noShow: number; cancelled: number }
  >();
  const consumedCreditByPlanId = new Map<string, number>();
  for (const item of bookingsByUserByStatus) {
    const userId = String(item._id.userId);
    const status = String(item._id.status);
    const user = customerById.get(userId);
    if (!user?.membershipPlanId) {
      continue;
    }

    const planSummary = checkInsByPlanId.get(user.membershipPlanId) || {
      attended: 0,
      noShow: 0,
      cancelled: 0,
    };

    if (status === BookingStatus.COMPLETED) {
      planSummary.attended += item.count || 0;
      consumedCreditByPlanId.set(
        user.membershipPlanId,
        (consumedCreditByPlanId.get(user.membershipPlanId) || 0) +
          (item.consumedCredit || 0),
      );
    }

    if (status === BookingStatus.NO_SHOW) {
      planSummary.noShow += item.count || 0;
      consumedCreditByPlanId.set(
        user.membershipPlanId,
        (consumedCreditByPlanId.get(user.membershipPlanId) || 0) +
          (item.consumedCredit || 0),
      );
    }

    if (status === BookingStatus.CANCELLED) {
      planSummary.cancelled += item.count || 0;
    }

    checkInsByPlanId.set(user.membershipPlanId, planSummary);
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
        consumedCreditByPlanId.get(planId) || 0,
        0,
      );
      const usagePercent =
        totalCredit > 0 ? (consumedCredit / totalCredit) * 100 : 0;
      const planCheckInSummary = checkInsByPlanId.get(planId) || {
        attended: 0,
        noShow: 0,
        cancelled: 0,
      };

      return {
        planId,
        planName: plan?.name || 'Unknown plan',
        activeCustomerCount: activeSummary.activeCustomerCount,
        currentCreditTotal: activeSummary.currentCreditTotal,
        totalCredit,
        consumedCredit,
        checkInCount: planCheckInSummary,
        usagePercent,
      };
    })
    .sort((left, right) => right.totalCredit - left.totalCredit);

  return packageStats;
}

function getCustomerDisplayName(customer: IActiveCustomerProjection): string {
  const fullName = [customer.firstName, customer.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  if (fullName) {
    return fullName;
  }

  if (customer.primaryEmail) {
    return customer.primaryEmail;
  }

  if (customer.primaryPhone) {
    return customer.primaryPhone;
  }

  return 'Unknown user';
}

function getCompanyDisplayName(company: ICoreCompanyProjection): string {
  if (company.primaryName) {
    return company.primaryName;
  }

  if (Array.isArray(company.names) && company.names.length > 0) {
    const firstNonEmptyName = company.names.find((name) =>
      Boolean(name?.trim()),
    );
    if (firstNonEmptyName) {
      return firstNonEmptyName;
    }
  }

  if (company.name) {
    return company.name;
  }

  return 'Unknown company';
}

async function getCompanyUserStats(
  context: IContext,
): Promise<OneFitDashboardCompanyUserStat[]> {
  const { models, subdomain } = context;

  const companies = (await sendTRPCMessage({
    subdomain,
    pluginName: 'core',
    method: 'query',
    module: 'companies',
    action: 'find',
    input: {
      query: {
        status: { $ne: 'deleted' },
      },
    },
    defaultValue: [] as ICoreCompanyProjection[],
  })) as ICoreCompanyProjection[];

  const companyIdByCustomerId = new Map<string, string>();
  for (const company of companies) {
    const companyId = String(company._id);
    const companyCustomerRelations = (await sendTRPCMessage({
      subdomain,
      pluginName: 'core',
      method: 'query',
      module: 'relation',
      action: 'getRelationIds',
      input: {
        contentType: 'core:company',
        contentId: companyId,
        relatedContentType: 'core:customer',
      },
      defaultValue: [] as string[],
    })) as string[];

    for (const relatedCustomerId of companyCustomerRelations) {
      if (!relatedCustomerId) {
        continue;
      }

      if (!companyIdByCustomerId.has(relatedCustomerId)) {
        companyIdByCustomerId.set(relatedCustomerId, companyId);
      }
    }
  }

  const activeCustomers = (await models.OneFitCustomer.find(
    {
      __t: 'OneFitCustomer',
      membershipStatus: 'active',
      membershipPlanId: { $exists: true, $ne: '' },
    },
    {
      _id: 1,
      firstName: 1,
      lastName: 1,
      primaryEmail: 1,
      primaryPhone: 1,
      membershipPlanId: 1,
      currentCreditBalance: 1,
    },
  ).lean()) as IActiveCustomerProjection[];

  if (!activeCustomers.length) {
    return [];
  }

  const companyById = new Map(
    companies.map((company) => [String(company._id), company]),
  );

  const planIds = Array.from(
    new Set(
      activeCustomers
        .map((customer) => customer.membershipPlanId)
        .filter((planId): planId is string => Boolean(planId)),
    ),
  );

  if (!planIds.length) {
    return [];
  }

  const plans = (await models.MembershipPlan.find(
    { _id: { $in: planIds } },
    { _id: 1, name: 1, creditAmount: 1 },
  ).lean()) as IMembershipPlanProjection[];

  const planById = new Map(plans.map((plan) => [String(plan._id), plan]));
  const activeCustomerIds = activeCustomers.map((customer) => String(customer._id));
  const latestPurchaseCreditTransactions = (await models.CreditTransaction.find(
    {
      userId: { $in: activeCustomerIds },
      transactionType: CreditTransactionType.PURCHASE,
    },
    {
      userId: 1,
      amount: 1,
      balanceAfter: 1,
      createdAt: 1,
    },
  )
    .sort({ createdAt: -1 })
    .lean()) as ILatestPurchaseCreditTransactionProjection[];
  const latestPurchaseTransactionByUserId = new Map<string, ILatestPurchaseCreditTransactionProjection>();

  for (const transaction of latestPurchaseCreditTransactions) {
    const userId = String(transaction.userId || '');
    if (!userId || latestPurchaseTransactionByUserId.has(userId)) {
      continue;
    }

    latestPurchaseTransactionByUserId.set(userId, transaction);
  }
  const latestExpirationCreditTransactions = (await models.CreditTransaction.find(
    {
      userId: { $in: activeCustomerIds },
      transactionType: CreditTransactionType.EXPIRATION,
    },
    {
      userId: 1,
      amount: 1,
      createdAt: 1,
    },
  )
    .sort({ createdAt: -1 })
    .lean()) as ILatestPurchaseCreditTransactionProjection[];
  const latestExpirationTransactionByUserId = new Map<string, ILatestPurchaseCreditTransactionProjection>();

  for (const transaction of latestExpirationCreditTransactions) {
    const userId = String(transaction.userId || '');
    if (!userId || latestExpirationTransactionByUserId.has(userId)) {
      continue;
    }

    latestExpirationTransactionByUserId.set(userId, transaction);
  }
  const usageCreditTransactions = (await models.CreditTransaction.find(
    {
      userId: { $in: activeCustomerIds },
      transactionType: {
        $in: [CreditTransactionType.USAGE, CreditTransactionType.REFUND],
      },
    },
    {
      userId: 1,
      amount: 1,
      transactionType: 1,
      createdAt: 1,
    },
  ).lean()) as IUsageCreditTransactionProjection[];
  const usageCreditByUserId = new Map<string, number>();

  for (const transaction of usageCreditTransactions) {
    const userId = String(transaction.userId || '');
    if (!userId) {
      continue;
    }

    const latestPurchaseTransaction = latestPurchaseTransactionByUserId.get(userId);
    const latestPurchaseDate = latestPurchaseTransaction?.createdAt;
    const usageCreatedAt = transaction.createdAt;

    if (!latestPurchaseDate || !usageCreatedAt || usageCreatedAt <= latestPurchaseDate) {
      continue;
    }

    const transactionAmount = Math.abs(transaction.amount || 0);
    const previousUsedAmount = usageCreditByUserId.get(userId) || 0;
    const signedAmount =
      transaction.transactionType === CreditTransactionType.REFUND
        ? -transactionAmount
        : transactionAmount;

    usageCreditByUserId.set(userId, previousUsedAmount + signedAmount);
  }

  return activeCustomers
    .map((customer) => {
      const userId = String(customer._id);
      const planId = customer.membershipPlanId;

      if (!planId) {
        return null;
      }

      const relatedCompanyId = companyIdByCustomerId.get(userId);
      const companyId = relatedCompanyId || 'no-company';
      const company = companyById.get(companyId);
      const plan = planById.get(planId);

      if (!plan) {
        return null;
      }

      const planCredit = plan.creditAmount || 0;
      const currentCredit = customer.currentCreditBalance || 0;
      const usedCredit = Math.max(usageCreditByUserId.get(userId) || 0, 0);
      const latestPurchaseCreditTransaction = latestPurchaseTransactionByUserId.get(
        userId,
      );
      const creditBeforeLastPurchase = latestPurchaseCreditTransaction
        ? Math.max(
            (latestPurchaseCreditTransaction.balanceAfter || 0) -
              (latestPurchaseCreditTransaction.amount || 0),
            0,
          )
        : 0;
      const lastPurchaseDate = latestPurchaseCreditTransaction?.createdAt || null;
      const latestExpirationCreditTransaction =
        latestExpirationTransactionByUserId.get(userId);
      const lastExpirationCredit = latestExpirationCreditTransaction
        ? Math.abs(latestExpirationCreditTransaction.amount || 0)
        : 0;

      return {
        companyId,
        companyName: company
          ? getCompanyDisplayName(company)
          : 'Хувь хэрэглэгч',
        userId,
        userName: getCustomerDisplayName(customer),
        userPhone: customer.primaryPhone || '',
        planId,
        planName: plan.name || 'Unknown plan',
        lastPurchaseDate,
        planCredit,
        creditBeforeLastPurchase,
        lastExpirationCredit,
        currentCredit,
        usedCredit,
      };
    })
    .filter((row): row is OneFitDashboardCompanyUserStat => Boolean(row))
    .sort((left, right) => {
      if (left.companyName === right.companyName) {
        return left.userName.localeCompare(right.userName);
      }

      return left.companyName.localeCompare(right.companyName);
    });
}

async function getB2bB2cSalesCounts(
  context: IContext,
  startDate: Date,
  endDate: Date,
): Promise<OneFitDashboardB2bB2cSales> {
  const { models } = context;
  const { gte, lte } = getBookingDateBounds(startDate, endDate);

  const purchaseMatch = {
    status: MembershipPurchaseStatus.PAID,
    deletedAt: null,
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
  };

  const [countResult] = await models.MembershipPurchase.aggregate([
    { $match: purchaseMatch },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        b2bCount: {
          $sum: {
            $cond: [
              {
                $gt: [
                  {
                    $strLenCP: {
                      $trim: {
                        input: { $ifNull: ['$companyId', ''] },
                      },
                    },
                  },
                  0,
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  if (!countResult?.total) {
    return {
      b2bCount: 0,
      b2cCount: 0,
      b2bPercent: 0,
      b2cPercent: 0,
    };
  }

  const total = countResult.total;
  const b2bCount = countResult.b2bCount || 0;
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
          $dateToString: {
            format: '%Y-%m',
            date: '$createdAt',
            timezone: 'UTC',
          },
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
      deletedAt: null,
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
    { _id: 1, companyId: 1, paidAt: 1, purchasedAt: 1 },
  ).lean()) as IPurchaseProjectionWithDates[];

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
    if (purchase.companyId) {
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

async function getBookingStatusByDay(
  context: IContext,
  startDate: Date,
  endDate: Date,
): Promise<OneFitDashboardBookingStatusDay[]> {
  const { models } = context;
  const filter = await buildBookingFilterForRange(context, startDate, endDate);
  const dayKeys = getDayKeysOverlappingRange(startDate, endDate);

  const countsByDay = new Map<
    string,
    { bookings: number; completed: number; noShow: number }
  >();

  for (const dayKey of dayKeys) {
    countsByDay.set(dayKey, { bookings: 0, completed: 0, noShow: 0 });
  }

  const rows = await models.Booking.aggregate([
    {
      $match: filter,
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$bookingDate',
            timezone: 'UTC',
          },
        },
        bookings: { $sum: 1 },
        completed: {
          $sum: {
            $cond: [{ $eq: ['$status', BookingStatus.COMPLETED] }, 1, 0],
          },
        },
        noShow: {
          $sum: {
            $cond: [{ $eq: ['$status', BookingStatus.NO_SHOW] }, 1, 0],
          },
        },
      },
    },
  ]);

  for (const row of rows) {
    const key = row._id as string;
    if (!countsByDay.has(key)) {
      continue;
    }

    countsByDay.set(key, {
      bookings: row.bookings || 0,
      completed: row.completed || 0,
      noShow: row.noShow || 0,
    });
  }

  return dayKeys.map((dayKey) => {
    const counts = countsByDay.get(dayKey)!;
    return {
      dayKey,
      bookings: counts.bookings,
      completed: counts.completed,
      noShow: counts.noShow,
    };
  });
}

export const dashboardQueries: Record<string, Resolver> = {
  async oneFitDashboardStats(
    _root: undefined,
    {
      startDate,
      endDate,
      planId,
    }: { startDate: Date; endDate: Date; planId?: string },
    context: IContext,
  ) {
    await ifTeamUserCheck(context, 'dashboardRead');
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
      companyUserStats,
      b2bB2cSales,
      userGrowthByMonth,
      bookingStatusByDay,
    ] = await Promise.all([
      countTotalOneFitUsers(context),
      countTotalOneFitUsersAsOf(context, prev.endDate),
      countDistinctBookingUsers(context, startDate, endDate),
      countDistinctBookingUsers(context, prev.startDate, prev.endDate),
      countNewOneFitCustomersInRange(context, startDate, endDate),
      countNewOneFitCustomersInRange(context, prev.startDate, prev.endDate),
      countBookingsInRange(context, startDate, endDate),
      countBookingsInRange(context, prev.startDate, prev.endDate),
      getCategoryDistribution(context, startDate, endDate, planId),
      getPackageStats(context, startDate, endDate),
      getCompanyUserStats(context),
      getB2bB2cSalesCounts(context, startDate, endDate),
      getUserGrowthByMonth(context, startDate, endDate),
      getBookingStatusByDay(context, startDate, endDate),
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
      bookingStatusByDay,
      categoryDistribution,
      packageStats,
      companyUserStats,
    };
  },
};

markResolvers(dashboardQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
