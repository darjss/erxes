import { useQuery } from '@apollo/client';
import { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Breadcrumb,
  Button,
  PageContainer,
  ScrollArea,
  Skeleton,
} from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import {
  IconChartBar,
  IconCash,
  IconAlertCircle,
  IconClockExclamation,
  IconFlagCheck,
  IconExchange,
  IconArrowUpRight,
  IconArrowDownRight,
  IconChartLine,
} from '@tabler/icons-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { format } from 'date-fns';
import { PROJECT_PAYMENT_PLAN_DATA, PROJECT_OFFERS_OVERVIEW } from '@/unit/graphql/unitStatsQueries';
import { IContractPayment } from '@/contract-payment/types';
import type { ComponentType } from 'react';

type Period = 'monthly' | 'yearly';

const EXPECTED_COLOR = '#6366f1';
const RECEIVED_COLOR = '#10b981';
const OFFER_COLOR = '#8b5cf6';

const formatAmount = (val: number) => {
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
  return val.toLocaleString();
};

const parseDateLike = (val: any): Date | null => {
  if (!val) return null;
  const num = Number(val);
  const d = new Date(isNaN(num) ? val : num);
  return isNaN(d.getTime()) ? null : d;
};

const bucketKey = (d: Date, period: Period) =>
  period === 'yearly' ? format(d, 'yyyy') : format(d, 'yyyy-MM');

const bucketLabel = (d: Date, period: Period) =>
  period === 'yearly' ? format(d, 'yyyy') : format(d, 'MMM yy');

// ── shared sub-components ──────────────────────────────────────────────────

const StatCard = ({
  icon: Icon,
  color,
  label,
  value,
  sub,
  loading,
}: {
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  label: string;
  value: string;
  sub?: string;
  loading?: boolean;
}) => (
  <div className="rounded-xl border bg-card p-5 flex gap-4 items-center">
    <div className="rounded-full p-2.5 shrink-0" style={{ backgroundColor: `${color}20` }}>
      <Icon className="size-5" style={{ color }} />
    </div>
    <div className="min-w-0">
      <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
      {loading ? (
        <Skeleton className="h-7 w-24" />
      ) : (
        <div className="text-2xl font-bold tabular-nums truncate">{value}</div>
      )}
      {sub && !loading && (
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      )}
    </div>
  </div>
);

type TooltipEntry = { dataKey: string; value: number; color: string };
type TooltipState = { x: number; y: number; label: string; entries: TooltipEntry[] } | null;

// ── chart helpers ──────────────────────────────────────────────────────────

function buildPaymentChartData(payments: IContractPayment[], period: Period) {
  const buckets = new Map<string, { label: string; expected: number; received: number }>();

  [...payments]
    .map((p) => ({ ...p, d: parseDateLike(p.dueDate) }))
    .filter((p): p is typeof p & { d: Date } => p.d !== null && p.d.getFullYear() < 2099)
    .sort((a, b) => a.d.getTime() - b.d.getTime())
    .forEach((p) => {
      const key = bucketKey(p.d, period);
      const slot = buckets.get(key) ?? { label: bucketLabel(p.d, period), expected: 0, received: 0 };
      slot.expected += p.amount ?? 0;
      slot.received += p.paidAmount ?? 0;
      buckets.set(key, slot);
    });

  let cumExp = 0;
  let cumRec = 0;
  return Array.from(buckets.values()).map((b) => {
    cumExp += b.expected;
    cumRec += b.received;
    return { label: b.label, expected: cumExp, received: cumRec };
  });
}

function buildOfferChartData(offers: { amount: number; date: string }[], period: Period) {
  const now = new Date();
  return [...offers]
    .map((o) => ({ ...o, d: parseDateLike(o.date) }))
    .filter((o): o is typeof o & { d: Date } => {
      if (o.d === null) return false;
      if (period === 'monthly') {
        return o.d.getFullYear() === now.getFullYear() && o.d.getMonth() === now.getMonth();
      }
      return o.d.getFullYear() === now.getFullYear();
    })
    .sort((a, b) => a.d.getTime() - b.d.getTime())
    .map((o) => ({ label: format(o.d, period === 'monthly' ? 'dd MMM' : 'MMM yy'), amount: o.amount ?? 0 }));
}

// ── chart components ───────────────────────────────────────────────────────

const PaymentPerformanceChart = ({
  payments,
  period,
}: {
  payments: IContractPayment[];
  period: Period;
}) => {
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartData = buildPaymentChartData(payments, period);

  if (!chartData.length) {
    return (
      <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">
        No payment data available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">
          {period === 'yearly' ? 'Annual' : 'Monthly'} Revenue Trend
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-4 rounded" style={{ backgroundColor: EXPECTED_COLOR }} />
            Expected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-4 rounded" style={{ backgroundColor: RECEIVED_COLOR }} />
            Received
          </span>
        </div>
      </div>
      <div ref={containerRef} style={{ width: '100%', height: 240, position: 'relative' }}>
        {tooltip && (() => {
          const cw = containerRef.current?.offsetWidth ?? 0;
          const flip = cw > 0 && tooltip.x > cw / 2;
          return (
            <div
              className="absolute z-10 pointer-events-none rounded-lg border bg-background shadow-md p-2 text-xs"
              style={{
                left: flip ? tooltip.x - 8 : tooltip.x + 12,
                top: Math.max(0, tooltip.y - 52),
                transform: flip ? 'translateX(-100%)' : 'none',
              }}
            >
              <p className="font-medium mb-1">{tooltip.label}</p>
              {tooltip.entries.map((e) => (
                <div key={e.dataKey} className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: e.color }} />
                  <span className="text-muted-foreground capitalize">{e.dataKey}:</span>
                  <span className="font-medium">{formatAmount(e.value)}</span>
                </div>
              ))}
            </div>
          );
        })()}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
            onMouseMove={(state: any) => {
              const idx = state.activeTooltipIndex;
              if (state.activeCoordinate && idx !== undefined && chartData[idx]) {
                const pt = chartData[idx];
                setTooltip({
                  x: state.activeCoordinate.x,
                  y: state.activeCoordinate.y,
                  label: pt.label,
                  entries: [
                    { dataKey: 'expected', value: pt.expected, color: EXPECTED_COLOR },
                    { dataKey: 'received', value: pt.received, color: RECEIVED_COLOR },
                  ],
                });
              } else {
                setTooltip(null);
              }
            }}
            onMouseLeave={() => setTooltip(null)}
          >
            <defs>
              <linearGradient id="ovGradExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={EXPECTED_COLOR} stopOpacity={0.25} />
                <stop offset="95%" stopColor={EXPECTED_COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ovGradRec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={RECEIVED_COLOR} stopOpacity={0.25} />
                <stop offset="95%" stopColor={RECEIVED_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={formatAmount} width={52} />
            <Area dataKey="expected" type="monotone" stroke={EXPECTED_COLOR} fill="url(#ovGradExp)" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Area dataKey="received" type="monotone" stroke={RECEIVED_COLOR} fill="url(#ovGradRec)" strokeWidth={2} dot={false} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const PriceInsightsChart = ({
  offers,
  period,
}: {
  offers: { _id: string; amount: number; date: string }[];
  period: Period;
}) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; value: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartData = buildOfferChartData(offers, period);

  if (!chartData.length) return null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold">Price Insights</p>
      <div ref={containerRef} style={{ width: '100%', height: 240, position: 'relative' }}>
        {tooltip && (() => {
          const cw = containerRef.current?.offsetWidth ?? 0;
          const flip = cw > 0 && tooltip.x > cw / 2;
          return (
            <div
              className="absolute z-10 pointer-events-none rounded-lg border bg-background shadow-md p-2 text-xs"
              style={{
                left: flip ? tooltip.x - 8 : tooltip.x + 12,
                top: Math.max(0, tooltip.y - 36),
                transform: flip ? 'translateX(-100%)' : 'none',
              }}
            >
              <p className="font-medium mb-1">{tooltip.label}</p>
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: OFFER_COLOR }} />
                <span className="font-medium">{formatAmount(tooltip.value)}</span>
              </div>
            </div>
          );
        })()}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
            onMouseMove={(state: any) => {
              const idx = state.activeTooltipIndex;
              if (state.activeCoordinate && idx !== undefined && chartData[idx]) {
                const pt = chartData[idx];
                setTooltip({ x: state.activeCoordinate.x, y: state.activeCoordinate.y, label: pt.label, value: pt.amount });
              } else {
                setTooltip(null);
              }
            }}
            onMouseLeave={() => setTooltip(null)}
          >
            <defs>
              <linearGradient id="ovGradOffer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={OFFER_COLOR} stopOpacity={0.25} />
                <stop offset="95%" stopColor={OFFER_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={formatAmount} width={52} />
            <Area dataKey="amount" type="monotone" stroke={OFFER_COLOR} fill="url(#ovGradOffer)" strokeWidth={2} dot={false} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ── page ───────────────────────────────────────────────────────────────────

export const OverviewPage = () => {
  const { projectId } = useParams();
  const [period, setPeriod] = useState<Period>('yearly');

  const { data: paymentData, loading: paymentLoading } = useQuery<{
    blockGetProjectPaymentPlanData: IContractPayment[];
  }>(PROJECT_PAYMENT_PLAN_DATA, {
    variables: { projectId },
    skip: !projectId,
  });

  const { data: offerData, loading: offerLoading } = useQuery<{
    blockGetOffersList: { list: { _id: string; status: string; amount: number; date: string }[] };
  }>(PROJECT_OFFERS_OVERVIEW, {
    variables: { projectId },
    skip: !projectId,
  });

  const payments = paymentData?.blockGetProjectPaymentPlanData ?? [];
  const offers = offerData?.blockGetOffersList?.list ?? [];
  const now = Date.now();
  const nowDate = new Date(now);
  const currentYear = nowDate.getFullYear();
  const currentMonth = nowDate.getMonth();

  const isInPeriod = (d: Date): boolean => {
    if (period === 'monthly') {
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    }
    return d.getFullYear() === currentYear;
  };

  const installments = payments.filter((p) => {
    if (p.label === 'Barter') return false;
    const d = parseDateLike(p.dueDate);
    if (!d || d.getFullYear() >= 2099) return false;
    return isInPeriod(d);
  });
  const barterPayments = payments.filter((p) => p.label === 'Barter');
  const completionPayments = payments.filter((p) => {
    const d = parseDateLike(p.dueDate);
    return d !== null && d.getFullYear() >= 2099;
  });

  const totalExpected = installments.reduce((s, p) => s + (p.amount ?? 0), 0);
  const totalReceived = installments.reduce((s, p) => s + (p.paidAmount ?? 0), 0);
  const shortfall = Math.max(0, totalExpected - totalReceived);
  const collectionRate = totalExpected > 0 ? Math.round((totalReceived / totalExpected) * 100) : 0;
  const overdueCount = installments.filter((p) => {
    if (p.status === 'paid') return false;
    const due = parseDateLike(p.dueDate)?.getTime() ?? 0;
    return due > 0 && due < now;
  }).length;

  const completionAmount = completionPayments.reduce((s, p) => s + (p.amount ?? 0), 0);
  const completionReceived = completionPayments.reduce((s, p) => s + (p.paidAmount ?? 0), 0);

  const barterAmount = barterPayments.reduce((s, p) => s + (p.amount ?? 0), 0);
  const barterReceived = barterPayments.reduce((s, p) => s + (p.paidAmount ?? 0), 0);
  const barterOverdueCount = barterPayments.filter((p) => {
    if (p.status === 'paid') return false;
    const due = parseDateLike(p.dueDate)?.getTime() ?? 0;
    return due > 0 && due < now;
  }).length;

  return (
    <PageContainer>
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to={`/block/project/${projectId}/overview`}>
                    <IconChartBar />
                    Overview
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </PageHeader.Start>
        {!paymentLoading && totalExpected > 0 && (
          <PageHeader.End>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: collectionRate >= 100 ? '#10b98120' : collectionRate >= 50 ? '#6366f120' : '#f59e0b20',
                color: collectionRate >= 100 ? '#10b981' : collectionRate >= 50 ? '#6366f1' : '#f59e0b',
              }}
            >
              {collectionRate}% collected
            </span>
          </PageHeader.End>
        )}
      </PageHeader>

      {/* Period tabs */}
      <div className="border-b px-5 flex items-center gap-1">
        {(['monthly', 'yearly'] as Period[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={`relative py-3 px-1 mr-3 text-sm font-medium capitalize focus:outline-none ${
              period === p ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
            {period === p && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      <ScrollArea className="flex-auto h-full">
        <div className="p-5 flex flex-col gap-6">
          {/* Stat cards */}
          <div className="grid grid-cols-6 gap-4">
            <StatCard
              icon={IconCash}
              color="#6366f1"
              label="Total Expected"
              value={`₮ ${formatAmount(totalExpected)}`}
              sub={period === 'monthly' ? 'This month' : 'This year'}
              loading={paymentLoading}
            />
            <StatCard
              icon={IconCash}
              color="#10b981"
              label="Total Received"
              value={`₮ ${formatAmount(totalReceived)}`}
              sub={totalExpected > 0 ? `${collectionRate}% collection rate` : undefined}
              loading={paymentLoading}
            />
            <StatCard
              icon={IconClockExclamation}
              color="#ef4444"
              label="Overdue"
              value={String(overdueCount)}
              sub={overdueCount > 0 ? `${overdueCount} installments` : 'None overdue'}
              loading={paymentLoading}
            />
            <StatCard
              icon={IconAlertCircle}
              color="#f59e0b"
              label="Shortfall"
              value={`₮ ${formatAmount(shortfall)}`}
              sub={totalExpected > 0 ? `${100 - collectionRate}% below target` : undefined}
              loading={paymentLoading}
            />
            <StatCard
              icon={IconFlagCheck}
              color="#8b5cf6"
              label="Completion Payment"
              value={`₮ ${formatAmount(completionAmount)}`}
              sub={completionAmount > 0 ? (completionReceived >= completionAmount ? 'Paid' : 'Pending on handover') : undefined}
              loading={paymentLoading}
            />
            <StatCard
              icon={IconExchange}
              color="#0ea5e9"
              label="Barter Payment"
              value={`₮ ${formatAmount(barterAmount)}`}
              sub={
                barterAmount === 0
                  ? undefined
                  : barterReceived >= barterAmount
                  ? 'Received'
                  : barterOverdueCount > 0
                  ? `${barterOverdueCount} overdue`
                  : 'Pending'
              }
              loading={paymentLoading}
            />
          </div>

          {/* Payment performance chart */}
          {paymentLoading ? (
            <Skeleton className="h-[300px] w-full rounded-xl" />
          ) : (
            <div className="rounded-xl border bg-card p-5">
              <PaymentPerformanceChart payments={payments} period={period} />
            </div>
          )}

          {/* Price insights stats + chart */}
          {offerLoading ? (
            <Skeleton className="h-[300px] w-full rounded-xl" />
          ) : offers.length > 0 ? (() => {
            const periodOffers = buildOfferChartData(offers, period);
            const amounts = periodOffers.map((o) => o.amount).filter((a) => a > 0);
            const avgAmount = amounts.length ? Math.round(amounts.reduce((s, a) => s + a, 0) / amounts.length) : 0;
            const highestAmount = amounts.length ? Math.max(...amounts) : 0;
            const lowestAmount = amounts.length ? Math.min(...amounts) : 0;
            return (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <StatCard
                    icon={IconChartLine}
                    color="#6366f1"
                    label="Avg. Offer Amount"
                    value={`₮ ${formatAmount(avgAmount)}`}
                    sub={period === 'monthly' ? 'This month' : 'This year'}
                    loading={false}
                  />
                  <StatCard
                    icon={IconArrowUpRight}
                    color="#10b981"
                    label="Highest Offer"
                    value={`₮ ${formatAmount(highestAmount)}`}
                    loading={false}
                  />
                  <StatCard
                    icon={IconArrowDownRight}
                    color="#f59e0b"
                    label="Lowest Offer"
                    value={`₮ ${formatAmount(lowestAmount)}`}
                    loading={false}
                  />
                </div>
                <div className="rounded-xl border bg-card p-5">
                  <PriceInsightsChart offers={offers} period={period} />
                </div>
              </>
            );
          })() : null}
        </div>
        <ScrollArea.Bar orientation="vertical" />
      </ScrollArea>
    </PageContainer>
  );
};
