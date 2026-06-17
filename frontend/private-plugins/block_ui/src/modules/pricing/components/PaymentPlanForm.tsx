import { Checkbox, DatePicker, Form, Input, Select } from 'erxes-ui';
import { SelectPaymentPlan } from './SelectPaymentPlan';
import { SelectPaymentPlanType } from './SelectPaymentPlanType';
import { UseFormReturn } from 'react-hook-form';
import { SelectPaymentPlanFrequency } from './SelectPaymentPlanFrequency';

const ONE_TIME_FREQUENCY = 'ONE_TIME';

const INTEREST_TYPE_OPTIONS = [
  { value: 'FLAT', label: 'Flat rate' },
  { value: 'REDUCING', label: 'Reducing balance' },
  { value: 'SIMPLE', label: 'Simple interest' },
];

export const PaymentPlanForm = ({ form }: { form: UseFormReturn<any> }) => {
  const frequency = form.watch('paymentPlan.frequency');
  const interestPct = form.watch('paymentPlan.interestPercentage') || 0;
  const isOneTime = frequency === ONE_TIME_FREQUENCY;
  const hasInterest = Number(interestPct) > 0;

  const handlePercentChange =
    (callback: (value: number) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      callback(Math.min(Math.max(Number(e.target.value), 0), 100));
    };

  const parsePaymentDates = (raw: string): number[] => {
    return raw
      .split(/[,\s]+/)
      .map((p) => parseInt(p, 10))
      .filter((n) => Number.isFinite(n) && n >= 1 && n <= 31);
  };

  const parseDateValue = (value: any) => {
    if (!value) return undefined;
    const num = Number(value);
    const d = new Date(isNaN(num) ? value : num);
    return isNaN(d.getTime()) ? undefined : d;
  };

  const handleDateChange = (onChange: (value: string | undefined) => void) =>
    (date: Date | Date[] | undefined) => {
      const d = Array.isArray(date) ? date[0] : date;
      onChange(d ? d.toISOString() : undefined);
    };

  return (
    <>
      <Form.Field
        name="paymentPlanId"
        render={({ field }) => (
          <Form.Item className="col-start-1">
            <Form.Label>Payment plan template</Form.Label>
            <SelectPaymentPlan
              value={field.value}
              onValueChange={field.onChange}
              form={form}
            />
          </Form.Item>
        )}
      />

      <Form.Field
        name="paymentPlan.type"
        render={({ field }) => (
          <Form.Item className="col-start-1">
            <Form.Label>Contract type</Form.Label>
            <SelectPaymentPlanType
              value={field.value}
              onValueChange={field.onChange}
              inForm
            />
            <Form.Message />
          </Form.Item>
        )}
      />

      <Form.Field
        name="paymentPlan.discountPercentage"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Discount %</Form.Label>
            <Input
              {...field}
              value={field.value ?? ''}
              onChange={handlePercentChange(field.onChange)}
              type="number"
              max={100}
              min={0}
            />
            <Form.Message />
          </Form.Item>
        )}
      />

      <Form.Field
        name="paymentPlan.downPaymentPercentage"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Down payment %</Form.Label>
            <Input
              {...field}
              value={field.value ?? ''}
              onChange={handlePercentChange(field.onChange)}
              type="number"
              max={100}
              min={0}
            />
            <Form.Message />
          </Form.Item>
        )}
      />

      <Form.Field
        name="paymentPlan.completionPaymentPercentage"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Completion payment %</Form.Label>
            <Input
              {...field}
              value={field.value ?? ''}
              onChange={handlePercentChange(field.onChange)}
              type="number"
              max={100}
              min={0}
            />
            <Form.Message />
          </Form.Item>
        )}
      />

      <Form.Field
        name="paymentPlan.interestPercentage"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Interest %</Form.Label>
            <Input
              {...field}
              value={field.value ?? ''}
              onChange={handlePercentChange(field.onChange)}
              type="number"
              max={100}
              min={0}
            />
            <Form.Message />
          </Form.Item>
        )}
      />

      {hasInterest && (
        <Form.Field
          name="paymentPlan.interestType"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Interest type</Form.Label>
              <Select
                value={field.value || 'FLAT'}
                onValueChange={field.onChange}
              >
                <Form.Control>
                  <Select.Trigger className="h-8">
                    <Select.Value placeholder="Select type" />
                  </Select.Trigger>
                </Form.Control>
                <Select.Content>
                  {INTEREST_TYPE_OPTIONS.map((opt) => (
                    <Select.Item key={opt.value} value={opt.value}>
                      {opt.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
              <Form.Message />
            </Form.Item>
          )}
        />
      )}

      <Form.Field
        name="paymentPlan.penaltyPercentage"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Penalty %</Form.Label>
            <Input
              {...field}
              value={field.value ?? ''}
              onChange={handlePercentChange(field.onChange)}
              type="number"
              max={100}
              min={0}
            />
            <Form.Message />
          </Form.Item>
        )}
      />

      <Form.Field
        name="paymentPlan.frequency"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Frequency</Form.Label>
            <SelectPaymentPlanFrequency
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                if (value === ONE_TIME_FREQUENCY) {
                  form.setValue('paymentPlan.installment', 1);
                  form.setValue('paymentPlan.paymentDates', []);
                }
              }}
              inForm
            />
            <Form.Message />
          </Form.Item>
        )}
      />

      {!isOneTime && (
        <Form.Field
          name="paymentPlan.installment"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Installments</Form.Label>
              <Input
                {...field}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(Number(e.target.value))}
                type="number"
                min={1}
              />
              <Form.Message />
            </Form.Item>
          )}
        />
      )}

      {!isOneTime && (
        <Form.Field
          name="paymentPlan.paymentDates"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Payment day(s) of month</Form.Label>
              <Input
                value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                onChange={(e) =>
                  field.onChange(parsePaymentDates(e.target.value))
                }
                placeholder="e.g. 15 or 15, 30"
              />
              <Form.Message />
            </Form.Item>
          )}
        />
      )}

      {!isOneTime && (
        <Form.Field
          name="paymentPlan.firstPaymentDate"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>First installment date</Form.Label>
              <DatePicker
                placeholder="Select date"
                value={parseDateValue(field.value)}
                onChange={handleDateChange(field.onChange)}
              />
              <Form.Message />
            </Form.Item>
          )}
        />
      )}

      <Form.Field
        name="paymentPlan.downPaymentDate"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Down payment due</Form.Label>
            <DatePicker
              placeholder="Select date"
              value={parseDateValue(field.value)}
              onChange={handleDateChange(field.onChange)}
            />
            <Form.Message />
          </Form.Item>
        )}
      />

      <Form.Field
        name="paymentPlan.vatIncluded"
        render={({ field }) => (
          <Form.Item className="flex flex-row items-center space-x-3 space-y-0 h-8 col-span-2">
            <Form.Control>
              <Checkbox
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            </Form.Control>
            <Form.Label variant="peer">VAT included</Form.Label>
          </Form.Item>
        )}
      />
    </>
  );
};
