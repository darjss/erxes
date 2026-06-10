import { DatePicker, InfoCard } from 'erxes-ui';
import { format } from 'date-fns';

const periodsPerYear = (frequency: string | undefined): number => {
  switch (frequency) {
    case 'ONE_TIME_PER_MONTH': return 12;
    case 'TWO_TIME_PER_MONTH': return 24;
    case 'THREE_TIME_PER_MONTH': return 36;
    case 'QUARTERLY': return 4;
    case 'HALF_YEARLY': return 2;
    case 'YEARLY': return 1;
    default: return 12;
  }
};
import { UseFormReturn } from 'react-hook-form';
import { ContractFormData } from '@/contract/constants/contractSchema';
import { generateInstallmentDates } from './contract-detail/shared';

const parseDateLike = (value: any): Date | null => {
  if (!value) return null;
  const num = Number(value);
  const d = new Date(isNaN(num) ? value : num);
  return isNaN(d.getTime()) ? null : d;
};

export const PaymentScheduleEditor = ({
  form,
}: {
  form: UseFormReturn<ContractFormData>;
}) => {
  const amount = form.watch('amount') || 0;
  const currency = form.watch('currency') || 'MNT';
  const contractDate = form.watch('date');
  const startDate = form.watch('startDate');
  const paymentPlan = form.watch('paymentPlan');
  const dueDates = form.watch('paymentPlan.paymentDueDates') || [];

  if (!paymentPlan) return null;

  const downPct = paymentPlan.downPaymentPercentage || 0;
  const advancePct = paymentPlan.advancePaymentPercentage || 0;
  const discountPct = paymentPlan.discountPercentage || 0;
  const interestPct = paymentPlan.interestPercentage || 0;
  const interestType = paymentPlan.interestType || 'FLAT';
  const frequency = paymentPlan.frequency;
  const isOneTime = frequency === 'ONE_TIME';
  const installmentCount = isOneTime
    ? 0
    : Math.max(0, paymentPlan.installment || 0);
  const ppy = periodsPerYear(frequency);

  if (!amount && installmentCount === 0 && !isOneTime) return null;

  const discountAmount = (amount * discountPct) / 100;
  const priceAfterDiscount = amount - discountAmount;
  const downAmount = (priceAfterDiscount * downPct) / 100;
  const advanceAmount = (priceAfterDiscount * advancePct) / 100;
  const principal = priceAfterDiscount - downAmount - advanceAmount;
  const principalPerInstallment =
    installmentCount > 0 ? principal / installmentCount : 0;

  const baseStart =
    parseDateLike(paymentPlan.firstPaymentDate) ||
    parseDateLike(startDate) ||
    parseDateLike(contractDate) ||
    new Date();
  const autoDates = generateInstallmentDates(
    baseStart,
    installmentCount,
    frequency,
    paymentPlan.paymentDates || [],
  );

  const getDueDate = (index: number): Date | undefined => {
    const override = dueDates[index];
    if (override) {
      const d = parseDateLike(override);
      if (d) return d;
    }
    return autoDates[index];
  };

  const setDueDate = (index: number, date: Date | undefined) => {
    const next = Array.from(
      { length: installmentCount },
      (_, i) => dueDates[i] || '',
    );
    next[index] = date ? date.toISOString() : '';
    form.setValue('paymentPlan.paymentDueDates', next, {
      shouldDirty: true,
    });
  };

  const getInterest = (index: number) => {
    if (interestPct <= 0 || installmentCount <= 0) return 0;
    if (interestType === 'FLAT') {
      return (principal * interestPct) / 100 / installmentCount;
    }
    if (interestType === 'REDUCING') {
      const remaining = principal - principalPerInstallment * index;
      return (remaining * interestPct) / 100 / ppy;
    }
    // SIMPLE: annualized total interest spread equally
    return ((principal * interestPct) / 100) * (installmentCount / ppy) / installmentCount;
  };

  const fmt = (val: number) =>
    new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(val);

  const hasInterest = interestPct > 0;
  const contractDateLabel = parseDateLike(contractDate);
  let grandTotal = 0;

  const Header = ({ children }: { children: React.ReactNode }) => (
    <div className="px-2 py-2 text-xs font-medium text-muted-foreground uppercase">
      {children}
    </div>
  );
  const Cell = ({ children }: { children: React.ReactNode }) => (
    <div className="px-2 py-2 border-t text-sm flex items-center">
      {children}
    </div>
  );

  return (
    <InfoCard title="Payment Schedule (preview)">
      <InfoCard.Content className="shadow-none p-0 overflow-hidden">
        <div
          className={`grid ${
            hasInterest ? 'grid-cols-6' : 'grid-cols-5'
          } bg-sidebar`}
        >
          <Header>Payment</Header>
          <Header>Due Date</Header>
          <Header>Type</Header>
          <Header>Principal</Header>
          {hasInterest && <Header>Interest</Header>}
          <Header>Total</Header>
        </div>
        {isOneTime ? (() => {
          const totalInterest = (priceAfterDiscount * interestPct) / 100;
          const rowTotal = priceAfterDiscount + totalInterest;
          grandTotal = rowTotal;
          return (
            <div
              className={`grid ${
                hasInterest ? 'grid-cols-6' : 'grid-cols-5'
              }`}
            >
              <Cell>Full payment</Cell>
              <Cell>
                {contractDateLabel
                  ? format(contractDateLabel, 'dd.MM.yyyy')
                  : '-'}
              </Cell>
              <Cell>One-time</Cell>
              <Cell>{fmt(priceAfterDiscount)}</Cell>
              {hasInterest && <Cell>{fmt(totalInterest)}</Cell>}
              <Cell>{fmt(rowTotal)}</Cell>
            </div>
          );
        })() : (
          <>
            {downAmount > 0 && (() => {
              grandTotal += downAmount;
              return (
                <div
                  className={`grid ${
                    hasInterest ? 'grid-cols-6' : 'grid-cols-5'
                  }`}
                >
                  <Cell>Reservation</Cell>
                  <Cell>
                    {contractDateLabel
                      ? format(contractDateLabel, 'dd.MM.yyyy')
                      : '-'}
                  </Cell>
                  <Cell>Down payment</Cell>
                  <Cell>{fmt(downAmount)}</Cell>
                  {hasInterest && <Cell>-</Cell>}
                  <Cell>{fmt(downAmount)}</Cell>
                </div>
              );
            })()}
            {advanceAmount > 0 && (() => {
              grandTotal += advanceAmount;
              const advanceDateLabel = parseDateLike(paymentPlan.advancePaymentDate) || contractDateLabel;
              return (
                <div
                  className={`grid ${
                    hasInterest ? 'grid-cols-6' : 'grid-cols-5'
                  }`}
                >
                  <Cell>Advance</Cell>
                  <Cell>
                    {advanceDateLabel
                      ? format(advanceDateLabel, 'dd.MM.yyyy')
                      : '-'}
                  </Cell>
                  <Cell>Advance payment</Cell>
                  <Cell>{fmt(advanceAmount)}</Cell>
                  {hasInterest && <Cell>-</Cell>}
                  <Cell>{fmt(advanceAmount)}</Cell>
                </div>
              );
            })()}
            {Array.from({ length: installmentCount }).map((_, index) => {
              const isLast = index === installmentCount - 1;
              const dueDate = getDueDate(index);
              const interest = getInterest(index);
              const rowTotal = principalPerInstallment + interest;
              grandTotal += rowTotal;
              return (
                <div
                  key={index}
                  className={`grid ${
                    hasInterest ? 'grid-cols-6' : 'grid-cols-5'
                  }`}
                >
                  <Cell>{index + 1}</Cell>
                  <Cell>
                    <DatePicker
                      value={dueDate}
                      onChange={(date) => {
                        const d = Array.isArray(date) ? date[0] : date;
                        setDueDate(index, d || undefined);
                      }}
                      placeholder="Pick date"
                    />
                  </Cell>
                  <Cell>
                    {isLast ? 'Final payment' : 'Progress payment'}
                  </Cell>
                  <Cell>{fmt(principalPerInstallment)}</Cell>
                  {hasInterest && <Cell>{fmt(interest)}</Cell>}
                  <Cell>{fmt(rowTotal)}</Cell>
                </div>
              );
            })}
          </>
        )}
        <div
          className={`grid ${
            hasInterest ? 'grid-cols-6' : 'grid-cols-5'
          } bg-sidebar border-t font-medium`}
        >
          <Cell>Total</Cell>
          <Cell>{discountPct > 0 ? `Discount: ${fmt(discountAmount)}` : ' '}</Cell>
          <Cell> </Cell>
          <Cell>{fmt(principal + downAmount)}</Cell>
          {hasInterest && (
            <Cell>{fmt(grandTotal - (principal + downAmount))}</Cell>
          )}
          <Cell>{fmt(grandTotal)}</Cell>
        </div>
      </InfoCard.Content>
    </InfoCard>
  );
};
