import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  IconBuilding,
  IconCalendar,
  IconChevronRight,
  IconFlame,
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react';
import {
  Button,
  ChartContainer,
  Command,
  Input,
  Popover,
  Select,
  SelectTree,
  Skeleton,
  cn,
} from 'erxes-ui';
import {
  addMonths,
  endOfDay,
  format,
  parse,
  startOfDay,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ONE_FIT_DASHBOARD_STATS } from '~/modules/dashboard/graphql/dashboardQueries';
import { useOneFitMode } from '~/modules/config/hooks/useOneFitMode';

interface MetricField {
  value: number;
  previousValue: number | null;
  changePercent: number | null;
}

interface CategoryDistributionItem {
  categoryId: string;
  label: string;
  parentId?: string;
  depth: number;
  count: number;
  percent: number;
}

interface PackageStatItem {
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

interface CompanyUserStatItem {
  companyId: string;
  companyName: string;
  userId: string;
  userName: string;
  userPhone: string;
  planId: string;
  planName: string;
  planCredit: number;
  currentCredit: number;
  usedCredit: number;
}

interface B2bB2cSalesStats {
  b2bCount: number;
  b2cCount: number;
  b2bPercent: number;
  b2cPercent: number;
}

interface UserGrowthMonthRow {
  monthKey: string;
  b2bUsers: number;
  b2cUsers: number;
  newUsers: number;
}

interface BookingStatusDayRow {
  dayKey: string;
  bookings: number;
  completed: number;
  noShow: number;
}

const B2B_COLOR = '#4285F4';
const B2C_COLOR = '#10B981';
const NEW_USERS_COLOR = '#F97316';
const BOOKINGS_COLOR = '#2563EB';
const COMPLETED_COLOR = '#16A34A';
const NO_SHOW_COLOR = '#DC2626';

function formatMetricValue(value: number, isAverage: boolean): string {
  if (isAverage) {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  }
  return Math.round(value).toLocaleString();
}

function KpiCard({
  title,
  subtitle,
  metric,
  icon: Icon,
  valueIsAverage,
}: {
  title: string;
  subtitle: string;
  metric: MetricField | undefined;
  icon: React.ComponentType<{ className?: string; stroke?: string | number }>;
  valueIsAverage?: boolean;
}) {
  const pct = metric?.changePercent;
  const isUp = pct != null && pct > 0;
  const isDown = pct != null && pct < 0;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-gray-900">{title}</span>
        <Icon className="size-5 shrink-0 text-gray-400" stroke={1.5} />
      </div>
      <div className="text-3xl font-bold tabular-nums text-gray-900">
        {metric
          ? formatMetricValue(metric.value, Boolean(valueIsAverage))
          : '—'}
      </div>
      <p className="text-xs text-gray-500">{subtitle}</p>
      <div className="flex items-center gap-1 text-sm">
        {pct == null ? (
          <span className="text-gray-400">—</span>
        ) : (
          <>
            {isUp ? (
              <IconTrendingUp className="size-4 text-emerald-600" />
            ) : isDown ? (
              <IconTrendingDown className="size-4 text-red-600" />
            ) : (
              <span className="text-gray-400">—</span>
            )}
            <span
              className={cn(
                'font-medium tabular-nums',
                isUp && 'text-emerald-600',
                isDown && 'text-red-600',
                !isUp && !isDown && 'text-gray-500',
              )}
            >
              {pct > 0 ? '+' : ''}
              {pct.toFixed(1)}%
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

type DashboardPreset = '1w' | '2w' | '1m' | '2m' | '1y';

function getRangeByPreset(preset: DashboardPreset): { from: Date; to: Date } {
  const now = new Date();
  const to = endOfDay(now);

  if (preset === '1w') {
    return { from: startOfDay(subWeeks(now, 1)), to };
  }

  if (preset === '2w') {
    return { from: startOfDay(subWeeks(now, 2)), to };
  }

  if (preset === '1m') {
    return { from: startOfDay(subMonths(now, 1)), to };
  }

  if (preset === '2m') {
    return { from: startOfDay(subMonths(now, 2)), to };
  }

  return { from: startOfDay(subYears(now, 1)), to };
}

function toDateInputValue(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

function parseDateInputValue(value: string): Date | null {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

export function MainIndicatorsDashboard() {
  const { mode, loading: modeLoading } = useOneFitMode();
  const isMaster = mode === 'master';

  const [preset, setPreset] = useState<DashboardPreset>('1w');
  const [collapsedCategoryIds, setCollapsedCategoryIds] = useState<string[]>(
    [],
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const range = useMemo(() => getRangeByPreset(preset), [preset]);
  const [startDate, setStartDate] = useState<string>(
    toDateInputValue(range.from),
  );
  const [endDate, setEndDate] = useState<string>(toDateInputValue(range.to));
  const from = useMemo(() => {
    const parsedDate = parseDateInputValue(startDate);
    if (!parsedDate) {
      return range.from;
    }

    return startOfDay(parsedDate);
  }, [range.from, startDate]);
  const to = useMemo(() => {
    const parsedDate = parseDateInputValue(endDate);
    if (!parsedDate) {
      return range.to;
    }

    return endOfDay(parsedDate);
  }, [endDate, range.to]);

  const { data, loading, error } = useQuery(ONE_FIT_DASHBOARD_STATS, {
    variables: {
      startDate: from.toISOString(),
      endDate: to.toISOString(),
    },
    skip: !isMaster || modeLoading,
    fetchPolicy: 'cache-and-network',
  });

  const stats = data?.oneFitDashboardStats;
  const categoryDistribution = (stats?.categoryDistribution ||
    []) as CategoryDistributionItem[];
  const rootLevelCategoryDistribution = useMemo(() => {
    if (!categoryDistribution.length) {
      return [];
    }

    const minDepth = Math.min(
      ...categoryDistribution.map((item) => item.depth),
    );

    return categoryDistribution.filter((item) => item.depth === minDepth);
  }, [categoryDistribution]);
  const packageStats = (stats?.packageStats || []) as PackageStatItem[];
  const companyUserStats = (stats?.companyUserStats ||
    []) as CompanyUserStatItem[];
  const companyFilterOptions = useMemo(() => {
    const uniqueCompanies = Array.from(
      new Map(
        companyUserStats.map((item) => [item.companyId, item.companyName]),
      ).entries(),
    )
      .map(([companyId, companyName]) => ({ companyId, companyName }))
      .sort((a, b) => a.companyName.localeCompare(b.companyName));

    return uniqueCompanies;
  }, [companyUserStats]);
  const filteredCompanyUserStats = useMemo(() => {
    if (selectedCompanyId === 'all') {
      return companyUserStats;
    }

    return companyUserStats.filter(
      (item) => item.companyId === selectedCompanyId,
    );
  }, [companyUserStats, selectedCompanyId]);
  const b2bB2cSales = stats?.b2bB2cSales as B2bB2cSalesStats | undefined;
  const hasCategoryData = categoryDistribution.length > 0;
  const hasPackageData = packageStats.length > 0;
  const hasCompanyUserStats = companyUserStats.length > 0;
  const hasFilteredCompanyUserStats = filteredCompanyUserStats.length > 0;
  const totalSalesCount =
    (b2bB2cSales?.b2bCount || 0) + (b2bB2cSales?.b2cCount || 0);
  const hasB2bB2cSales = totalSalesCount > 0;
  const b2bB2cChartData = [
    {
      name: 'B2B',
      value: b2bB2cSales?.b2bCount || 0,
      percent: b2bB2cSales?.b2bPercent || 0,
      color: B2B_COLOR,
    },
    {
      name: 'B2C',
      value: b2bB2cSales?.b2cCount || 0,
      percent: b2bB2cSales?.b2cPercent || 0,
      color: B2C_COLOR,
    },
  ];
  const categoryById = useMemo(
    () =>
      new Map(
        categoryDistribution.map((category) => [category.categoryId, category]),
      ),
    [categoryDistribution],
  );
  const categoryChildrenByParentId = useMemo(() => {
    const result = new Map<string, number>();

    for (const category of categoryDistribution) {
      if (!category.parentId) {
        continue;
      }

      const prevCount = result.get(category.parentId) || 0;
      result.set(category.parentId, prevCount + 1);
    }

    return result;
  }, [categoryDistribution]);
  const visibleCategoryDistribution = useMemo(() => {
    const collapsedIds = new Set(collapsedCategoryIds);

    return categoryDistribution.filter((category) => {
      let parentId = category.parentId;

      while (parentId) {
        if (collapsedIds.has(parentId)) {
          return false;
        }

        parentId = categoryById.get(parentId)?.parentId;
      }

      return true;
    });
  }, [categoryById, categoryDistribution, collapsedCategoryIds]);
  const categoryChartSource = useMemo(() => {
    if (!selectedCategoryId) {
      return rootLevelCategoryDistribution;
    }

    if (collapsedCategoryIds.includes(selectedCategoryId))
      return rootLevelCategoryDistribution;

    const children = categoryDistribution.filter(
      (category) => category.parentId === selectedCategoryId,
    );

    if (children.length) {
      return children;
    }

    const selectedCategory = categoryDistribution.filter(
      (category) => category.categoryId === selectedCategoryId,
    );

    return selectedCategory.length
      ? selectedCategory
      : rootLevelCategoryDistribution;
  }, [
    selectedCategoryId,
    categoryDistribution,
    collapsedCategoryIds,
    rootLevelCategoryDistribution,
  ]);
  const categoryChartItems = useMemo(
    () => categoryChartSource.slice(0, 8),
    [categoryChartSource],
  );
  const categoryChartData = useMemo(
    () =>
      categoryChartItems.map((category) => ({
        name: category.label,
        value: category.count,
        percent: category.percent,
      })),
    [categoryChartItems],
  );
  const selectedCategoryLabel = useMemo(() => {
    if (!selectedCategoryId) {
      return 'Бүх категори';
    }

    const selected = categoryDistribution.find(
      (category) => category.categoryId === selectedCategoryId,
    );

    return selected?.label || 'Бүх категори';
  }, [categoryDistribution, selectedCategoryId]);
  const categoryChartConfig = {
    value: {
      label: 'Count',
      color: '#3b82f6',
    },
  };

  const userGrowthByMonth = (stats?.userGrowthByMonth ||
    []) as UserGrowthMonthRow[];

  const growthMonthKeys = useMemo(() => {
    const keys = Array.from(
      new Set(userGrowthByMonth.map((row) => row.monthKey).filter(Boolean)),
    );

    return keys.sort((a, b) => a.localeCompare(b));
  }, [userGrowthByMonth]);

  const growthChartData = useMemo(() => {
    const growthByMonthKey = new Map(
      userGrowthByMonth.map((row) => [row.monthKey, row]),
    );

    let cumulativeB2bUsers = 0;
    let cumulativeB2cUsers = 0;
    let cumulativeNewUsers = 0;

    return growthMonthKeys.map((monthKey) => {
      const row = growthByMonthKey.get(monthKey);
      const b2bUsers = row?.b2bUsers || 0;
      const b2cUsers = row?.b2cUsers || 0;
      const newUsers = row?.newUsers || 0;

      cumulativeB2bUsers += b2bUsers;
      cumulativeB2cUsers += b2cUsers;
      cumulativeNewUsers += newUsers;

      return {
        monthKey,
        monthLabel: format(
          parse(`${monthKey}-01`, 'yyyy-MM-dd', new Date()),
          'MMM yyyy',
        ),
        b2bUsers,
        b2cUsers,
        newUsers,
        cumulativeB2bUsers,
        cumulativeB2cUsers,
        cumulativeNewUsers,
      };
    });
  }, [growthMonthKeys, userGrowthByMonth]);

  const hasGrowthChartData = growthChartData.length > 0;
  const bookingStatusByDay = (stats?.bookingStatusByDay ||
    []) as BookingStatusDayRow[];
  const bookingStatusChartData = useMemo(
    () =>
      bookingStatusByDay.map((row) => ({
        ...row,
        dayLabel: format(parse(row.dayKey, 'yyyy-MM-dd', new Date()), 'MMM dd'),
      })),
    [bookingStatusByDay],
  );
  const hasBookingStatusChartData = bookingStatusChartData.some(
    (row) => row.bookings > 0 || row.completed > 0 || row.noShow > 0,
  );

  const rangeLabel =
    from && to
      ? `${format(from, 'MMM dd, yyyy')} - ${format(to, 'MMM dd, yyyy')}`
      : 'Select range';

  const toggleCollapse = (categoryId: string) => {
    setCollapsedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };
  const handleCategoryToggle = (categoryId: string, hasChildren: boolean) => {
    if (!hasChildren) {
      return;
    }

    const isCurrentlyCollapsed = collapsedCategoryIds.includes(categoryId);
    if (!isCurrentlyCollapsed && selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
    }

    toggleCollapse(categoryId);
  };

  if (modeLoading) {
    return null;
  }

  if (!isMaster) {
    return null;
  }

  return (
    <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Үндсэн үзүүлэлтүүд
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Шүүлт:</span>
          <div className="flex items-center gap-2">
            <Select
              value={preset}
              onValueChange={(value) => {
                const selectedPreset = value as DashboardPreset;
                const selectedRange = getRangeByPreset(selectedPreset);
                setPreset(selectedPreset);
                setStartDate(toDateInputValue(selectedRange.from));
                setEndDate(toDateInputValue(selectedRange.to));
              }}
            >
              <Select.Trigger className="min-w-[220px] border-gray-200">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="1w">1 week ago</Select.Item>
                <Select.Item value="2w">2 weeks ago</Select.Item>
                <Select.Item value="1m">1 month ago</Select.Item>
                <Select.Item value="2m">2 months ago</Select.Item>
                <Select.Item value="1y">1 year ago</Select.Item>
              </Select.Content>
            </Select>
            <Input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value || '')}
              className="w-[170px]"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value || '')}
              className="w-[170px]"
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600">
          Unable to load dashboard statistics. Please try again.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {loading && !stats ? (
          <>
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </>
        ) : (
          <>
            <KpiCard
              title="Нийт хэрэглэгчид"
              subtitle="ONEFIT хэрэглэсэн"
              metric={stats?.totalOneFitUsers}
              icon={IconUsers}
            />
            <KpiCard
              title="Идэвхтэй хэрэглэгчид"
              subtitle="Сонгосон хугацаанд"
              metric={stats?.activeUsersInPeriod}
              icon={IconFlame}
            />
            <KpiCard
              title="B2B байгууллага"
              subtitle="Идэвхтэй компани"
              metric={stats?.b2bOrganizationsActive}
              icon={IconBuilding}
            />
            <KpiCard
              title="Шинэ хэрэглэгчид"
              subtitle="Сонгосон хугацаанд"
              metric={stats?.newUsersInPeriod}
              icon={IconUsers}
            />
            <KpiCard
              title="Дундаж арр зочилт"
              subtitle="Нэг хэрэглэгчид"
              metric={stats?.averageBookingsPerActiveUserInPeriod}
              icon={IconCalendar}
              valueIsAverage
            />
          </>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">
            Захиалгын төлөвийн динамик
          </h3>
          <p className="mt-1 text-sm text-gray-500">{rangeLabel}</p>
        </div>

        {loading && !stats ? (
          <Skeleton className="h-[320px] w-full" />
        ) : !hasBookingStatusChartData ? (
          <p className="mt-4 text-sm text-gray-500">
            Сонгосон хугацаанд захиалгын төлөвийн өгөгдөл алга байна.
          </p>
        ) : (
          <div className="mt-4 h-[320px] w-full">
            <LineChart
              data={bookingStatusChartData}
              width={1000}
              height={400}
              margin={{
                top: 10,
                right: 16,
                left: 4,
                bottom: 8,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
              <XAxis
                dataKey="dayLabel"
                tick={{ fill: '#71717a', fontSize: 11 }}
                axisLine={{ stroke: '#d4d4d8' }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                axisLine={{ stroke: '#d4d4d8' }}
                tickLine={false}
                width={40}
                domain={[0, 'dataMax + 1']}
              />
              <Tooltip
                formatter={(value: number) => value.toLocaleString()}
                labelFormatter={(label) => String(label)}
              />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: 16 }}
              />
              <Line
                type="monotone"
                name="Bookings"
                dataKey="bookings"
                stroke={BOOKINGS_COLOR}
                strokeWidth={2}
                dot={{ r: 3, fill: BOOKINGS_COLOR, stroke: BOOKINGS_COLOR }}
                activeDot={{
                  r: 5,
                  fill: BOOKINGS_COLOR,
                  stroke: BOOKINGS_COLOR,
                }}
              />
              <Line
                type="monotone"
                name="Completed"
                dataKey="completed"
                stroke={COMPLETED_COLOR}
                strokeWidth={2}
                dot={{ r: 3, fill: COMPLETED_COLOR, stroke: COMPLETED_COLOR }}
                activeDot={{
                  r: 5,
                  fill: COMPLETED_COLOR,
                  stroke: COMPLETED_COLOR,
                }}
              />
              <Line
                type="monotone"
                name="No Show"
                dataKey="noShow"
                stroke={NO_SHOW_COLOR}
                strokeWidth={2}
                dot={{ r: 3, fill: NO_SHOW_COLOR, stroke: NO_SHOW_COLOR }}
                activeDot={{ r: 5, fill: NO_SHOW_COLOR, stroke: NO_SHOW_COLOR }}
              />
            </LineChart>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">
            Хэрэглэгчийн өсөлтийн динамик
          </h3>
          <p className="mt-1 text-sm text-gray-500">All time</p>
        </div>

        {loading && !stats ? (
          <Skeleton className="h-[320px] w-full" />
        ) : !hasGrowthChartData ? (
          <p className="mt-4 text-sm text-gray-500">
            Сонгосон хугацаанд үзүүлэх сарын өгөгдөл алга байна.
          </p>
        ) : (
          <div className="mt-4 h-[320px] w-full">
            <LineChart
              data={growthChartData}
              width={1000}
              height={400}
              margin={{
                top: 10,
                right: 16,
                left: 4,
                bottom: 8,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
              <XAxis
                dataKey="monthLabel"
                tick={{ fill: '#71717a', fontSize: 11 }}
                axisLine={{ stroke: '#d4d4d8' }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                axisLine={{ stroke: '#d4d4d8' }}
                tickLine={false}
                width={40}
                domain={[0, 'dataMax + 1']}
              />
              <Tooltip
                formatter={(value: number) => value.toLocaleString()}
                labelFormatter={(label) => String(label)}
              />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: 16 }}
              />
              <Line
                type="monotone"
                name="B2B"
                dataKey="cumulativeB2bUsers"
                stroke={B2B_COLOR}
                strokeWidth={2}
                dot={{ r: 4, fill: B2B_COLOR, stroke: B2B_COLOR }}
                activeDot={{ r: 5, fill: B2B_COLOR, stroke: B2B_COLOR }}
              />
              <Line
                type="monotone"
                name="B2C"
                dataKey="cumulativeB2cUsers"
                stroke={B2C_COLOR}
                strokeWidth={2}
                dot={{ r: 4, fill: B2C_COLOR, stroke: B2C_COLOR }}
                activeDot={{ r: 5, fill: B2C_COLOR, stroke: B2C_COLOR }}
              />
              <Line
                type="monotone"
                name="Шинэ хэрэглэгчид"
                dataKey="cumulativeNewUsers"
                stroke={NEW_USERS_COLOR}
                strokeWidth={2}
                dot={{ r: 4, fill: NEW_USERS_COLOR, stroke: NEW_USERS_COLOR }}
                activeDot={{
                  r: 5,
                  fill: NEW_USERS_COLOR,
                  stroke: NEW_USERS_COLOR,
                }}
              />
            </LineChart>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-base font-semibold text-gray-900">
            B2B болон B2C борлуулт
          </h3>

          {loading && !stats ? (
            <div className="mt-4 space-y-3">
              <Skeleton className="h-60 w-full max-w-xl" />
              <Skeleton className="h-6 w-full max-w-sm" />
              <Skeleton className="h-6 w-full max-w-sm" />
            </div>
          ) : !hasB2bB2cSales ? (
            <p className="mt-4 text-sm text-gray-500">
              Сонгосон хугацаанд B2B/B2C борлуулалтын өгөгдөл алга байна.
            </p>
          ) : (
            <div className="mt-4">
              <div className="h-72 w-full max-w-xl">
                <PieChart width={460} height={280}>
                  <Pie
                    data={b2bB2cChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name}: ${(percent ?? 0).toFixed(1)}%`
                    }
                    labelLine={false}
                  >
                    {b2bB2cChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => value.toLocaleString()}
                    cursor={{ fill: '#f4f4f5' }}
                  />
                </PieChart>
              </div>

              <div className="mt-2 max-w-sm space-y-3">
                <div className="flex items-center justify-between text-base">
                  <span className="text-gray-700">B2B борлуулт:</span>
                  <span className="font-semibold tabular-nums text-gray-900">
                    {(b2bB2cSales?.b2bCount || 0).toLocaleString()} (
                    {(b2bB2cSales?.b2bPercent || 0).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-base">
                  <span className="text-gray-700">B2C борлуулт:</span>
                  <span className="font-semibold tabular-nums text-gray-900">
                    {(b2bB2cSales?.b2cCount || 0).toLocaleString()} (
                    {(b2bB2cSales?.b2cPercent || 0).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-base font-semibold text-gray-900">
            Үйлчилгээний категори
          </h3>

          {loading && !stats ? (
            <div className="mt-4 space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : !hasCategoryData ? (
            <p className="mt-4 text-sm text-gray-500">
              Сонгосон хугацаанд категорийн өгөгдөл алга байна.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              <SelectTree.Provider
                id="dashboard-category-distribution-select"
                ordered
                length={categoryDistribution.length}
              >
                <Popover
                  open={categoryDropdownOpen}
                  onOpenChange={setCategoryDropdownOpen}
                >
                  <Popover.Trigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={categoryDropdownOpen}
                      className="w-full max-w-md justify-between border-gray-200 font-normal"
                    >
                      <span className="truncate">{selectedCategoryLabel}</span>
                      <IconChevronRight className="size-4 -rotate-90 text-gray-500" />
                    </Button>
                  </Popover.Trigger>
                  <Popover.Content className="w-[420px] p-0" align="start">
                    <Command shouldFilter={false}>
                      <Command.List className="max-h-[300px] overflow-y-auto p-1">
                        <Command.Item
                          value="__all__"
                          onSelect={() => {
                            setSelectedCategoryId(null);
                            setCategoryDropdownOpen(false);
                          }}
                        >
                          Бүх категори
                        </Command.Item>
                        {visibleCategoryDistribution.map((category) => {
                          const safeDepth = Math.max(category.depth || 0, 0);
                          const hasChildren = Boolean(
                            categoryChildrenByParentId.get(category.categoryId),
                          );
                          const isCollapsed = collapsedCategoryIds.includes(
                            category.categoryId,
                          );
                          const isSelected =
                            selectedCategoryId === category.categoryId;

                          return (
                            <SelectTree.Item
                              key={category.categoryId}
                              _id={category.categoryId}
                              order={category.categoryId}
                              hasChildren={hasChildren}
                              name={category.label}
                              value={category.categoryId}
                              selected={isSelected}
                              onSelect={() => {
                                setSelectedCategoryId(category.categoryId);
                                setCategoryDropdownOpen(false);
                              }}
                            >
                              <div
                                className={cn(
                                  'flex w-full items-center gap-1 rounded-md px-2 py-1.5',
                                  isSelected && 'bg-gray-100',
                                )}
                                style={{ paddingLeft: `${safeDepth * 16}px` }}
                              >
                                {hasChildren ? (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-6"
                                    onClick={(event) => {
                                      event.preventDefault();
                                      event.stopPropagation();
                                      handleCategoryToggle(
                                        category.categoryId,
                                        true,
                                      );
                                    }}
                                  >
                                    <IconChevronRight
                                      className={cn(
                                        'size-4 transition-transform',
                                        !isCollapsed && 'rotate-90',
                                      )}
                                    />
                                  </Button>
                                ) : (
                                  <span className="inline-block size-6" />
                                )}
                                <span className="truncate text-sm text-gray-900">
                                  {category.label}
                                </span>
                              </div>
                            </SelectTree.Item>
                          );
                        })}
                      </Command.List>
                    </Command>
                  </Popover.Content>
                </Popover>
              </SelectTree.Provider>

              {categoryChartItems.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <ChartContainer
                    config={categoryChartConfig}
                    className="h-52 w-full max-w-2xl"
                  >
                    <BarChart
                      data={categoryChartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical
                        stroke="#d4d4d8"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#52525b', fontSize: 12 }}
                        axisLine={{ stroke: '#a1a1aa' }}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: '#52525b', fontSize: 12 }}
                        axisLine={{ stroke: '#a1a1aa' }}
                        tickLine={false}
                        width={36}
                      />
                      <Tooltip
                        formatter={(value: number) => value.toLocaleString()}
                        cursor={{ fill: '#f4f4f5' }}
                      />
                      <Bar
                        dataKey="value"
                        fill="var(--color-value)"
                        radius={[2, 2, 0, 0]}
                      >
                        <LabelList
                          dataKey="percent"
                          position="top"
                          formatter={(value) =>
                            `${Math.round(Number(value) || 0)}%`
                          }
                          className="fill-gray-600 text-xs"
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-base font-semibold text-gray-900">
          Багц бүрийн дэлгэрэнгүй мэдээлэл
        </h3>

        {loading && !stats ? (
          <div className="mt-4 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : !hasPackageData ? (
          <p className="mt-4 text-sm text-gray-500">
            Идэвхтэй багцын өгөгдөл алга байна.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-3 pr-4 font-medium">Багц нэр</th>
                  <th className="py-3 pr-4 font-medium">Идэвхтэй хэрэглэгч</th>
                  <th className="py-3 pr-4 font-medium">Одоогийн кредит</th>
                  <th className="py-3 pr-4 font-medium">Нийт кредит</th>
                  <th className="py-3 pr-4 font-medium">Кредит ашиглалт</th>
                  <th className="py-3 pr-4 font-medium">Check-in тоо</th>
                  <th className="py-3 font-medium">Ашиглалтын хувь</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {packageStats.map((item) => {
                  const safeUsagePercent = Math.min(
                    Math.max(item.usagePercent, 0),
                    100,
                  );

                  return (
                    <tr key={item.planId} className="text-gray-900">
                      <td className="py-3 pr-4">{item.planName}</td>
                      <td className="py-3 pr-4 tabular-nums">
                        {Math.round(item.activeCustomerCount).toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 tabular-nums">
                        {Math.round(item.currentCreditTotal).toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 tabular-nums">
                        {Math.round(item.totalCredit).toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 tabular-nums">
                        {Math.round(item.consumedCredit).toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 tabular-nums">
                        <div className="flex flex-col gap-1 text-xs sm:text-sm">
                          <span>
                            attended:{' '}
                            {Math.round(
                              item.checkInCount.attended,
                            ).toLocaleString()}
                          </span>
                          <span>
                            no_show:{' '}
                            {Math.round(
                              item.checkInCount.noShow,
                            ).toLocaleString()}
                          </span>
                          <span>
                            cancelled:{' '}
                            {Math.round(
                              item.checkInCount.cancelled,
                            ).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex min-w-[180px] items-center gap-3">
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-[#04051f]"
                              style={{ width: `${safeUsagePercent}%` }}
                            />
                          </div>
                          <span className="min-w-[40px] text-right tabular-nums">
                            {Math.round(safeUsagePercent)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-gray-900">
            Компанийн хэрэглэгчийн кредит ашиглалт
          </h3>
          <Select
            value={selectedCompanyId}
            onValueChange={setSelectedCompanyId}
          >
            <Select.Trigger className="min-w-[240px] border-gray-200">
              <Select.Value placeholder="Компани сонгох" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">Бүх компани</Select.Item>
              {companyFilterOptions.map((company) => (
                <Select.Item key={company.companyId} value={company.companyId}>
                  {company.companyName}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        {loading && !stats ? (
          <div className="mt-4 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : !hasCompanyUserStats ? (
          <p className="mt-4 text-sm text-gray-500">
            Компанийн хэрэглэгчийн кредитийн өгөгдөл алга байна.
          </p>
        ) : !hasFilteredCompanyUserStats ? (
          <p className="mt-4 text-sm text-gray-500">
            Сонгосон компанид тохирох кредитийн өгөгдөл алга байна.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-3 pr-4 font-medium">Компани</th>
                  <th className="py-3 pr-4 font-medium">Хэрэглэгч</th>
                  <th className="py-3 pr-4 font-medium">Багц</th>
                  <th className="py-3 pr-4 font-medium">Багцын кредит</th>
                  <th className="py-3 pr-4 font-medium">Одоогийн кредит</th>
                  <th className="py-3 pr-4 font-medium">Ашигласан кредит</th>
                  <th className="py-3 font-medium">Ашиглалтын хувь</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCompanyUserStats.map((item) => {
                  const safeUsedCredit = Math.max(item.usedCredit || 0, 0);
                  const usagePercent =
                    item.planCredit > 0
                      ? Math.min(
                          Math.max((safeUsedCredit / item.planCredit) * 100, 0),
                          100,
                        )
                      : 0;
                  const usageBarColorClass =
                    usagePercent >= 80
                      ? 'bg-red-500'
                      : usagePercent >= 50
                        ? 'bg-amber-500'
                        : 'bg-emerald-500';
                  const usageTextColorClass =
                    usagePercent >= 80
                      ? 'text-red-600'
                      : usagePercent >= 50
                        ? 'text-amber-600'
                        : 'text-emerald-600';

                  return (
                    <tr
                      key={`${item.companyId}-${item.userId}-${item.planId}`}
                      className="text-gray-900"
                    >
                      <td className="py-3 pr-4">{item.companyName}</td>
                      <td className="py-3 pr-4">
                        {item.userName}
                        {item.userPhone ? ` (${item.userPhone})` : ''}
                      </td>
                      <td className="py-3 pr-4">{item.planName}</td>
                      <td className="py-3 pr-4 tabular-nums">
                        {Math.round(item.planCredit || 0).toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 tabular-nums">
                        {Math.round(item.currentCredit || 0).toLocaleString()}
                      </td>
                      <td className="py-3 tabular-nums">
                        {Math.round(safeUsedCredit).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <div className="flex min-w-[180px] items-center gap-3">
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                              className={cn(
                                'h-2 rounded-full',
                                usageBarColorClass,
                              )}
                              style={{ width: `${usagePercent}%` }}
                            />
                          </div>
                          <span
                            className={cn(
                              'min-w-[40px] text-right tabular-nums font-medium',
                              usageTextColorClass,
                            )}
                          >
                            {Math.round(usagePercent)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
