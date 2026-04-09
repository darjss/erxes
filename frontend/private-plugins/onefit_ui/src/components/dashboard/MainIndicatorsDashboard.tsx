import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  IconBuilding,
  IconCalendar,
  IconFlame,
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react';
import { Button, Select, Skeleton, cn } from 'erxes-ui';
import {
  endOfDay,
  format,
  startOfDay,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import { ONE_FIT_DASHBOARD_STATS } from '~/modules/dashboard/graphql/dashboardQueries';
import { useOneFitMode } from '~/modules/config/hooks/useOneFitMode';

interface MetricField {
  value: number;
  previousValue: number | null;
  changePercent: number | null;
}

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

export function MainIndicatorsDashboard() {
  const { mode, loading: modeLoading } = useOneFitMode();
  const isMaster = mode === 'master';

  const [preset, setPreset] = useState<DashboardPreset>('1w');
  const range = useMemo(() => getRangeByPreset(preset), [preset]);
  const from = range.from;
  const to = range.to;

  const { data, loading, error } = useQuery(ONE_FIT_DASHBOARD_STATS, {
    variables: {
      startDate: from.toISOString(),
      endDate: to.toISOString(),
    },
    skip: !isMaster || modeLoading,
    fetchPolicy: 'cache-and-network',
  });

  if (modeLoading) {
    return null;
  }

  if (!isMaster) {
    return null;
  }

  const stats = data?.oneFitDashboardStats;

  const rangeLabel =
    from && to
      ? `${format(from, 'MMM dd, yyyy')} - ${format(to, 'MMM dd, yyyy')}`
      : 'Select range';

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
              onValueChange={(value) => setPreset(value as DashboardPreset)}
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
            <Button
              type="button"
              variant="outline"
              className="min-w-[240px] justify-start gap-2 border-gray-200 font-normal"
            >
              <IconCalendar className="size-4 text-gray-500" />
              {rangeLabel}
            </Button>
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
    </section>
  );
}
