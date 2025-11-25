import { Form, Input } from 'erxes-ui';
import { SelectPaymentPlan } from './SelectPaymentPlan';
import { SelectPaymentPlanType } from './SelectPaymentPlanType';
import { UseFormReturn } from 'react-hook-form';
import { SelectPaymentPlanFrequency } from './SelectPaymentPlanFrequency';

export const PaymentPlanForm = ({ form }: { form: UseFormReturn<any> }) => {
  const handlePercentChange =
    (callback: (value: number) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      callback(Math.min(Math.max(Number(e.target.value), 0), 100));
    };
  return (
    <>
      <Form.Field
        name="paymentPlanId"
        render={({ field }) => (
          <Form.Item className="col-start-1">
            <Form.Label>Payment plan</Form.Label>
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
            <Form.Label>type</Form.Label>
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
            <Form.Label>discount percentage</Form.Label>
            <Input
              {...field}
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
            <Form.Label>down payment percentage</Form.Label>
            <Input
              {...field}
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
            <Form.Label>interest percentage</Form.Label>
            <Input
              {...field}
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
            <Form.Label>frequency</Form.Label>
            <SelectPaymentPlanFrequency
              value={field.value}
              onValueChange={field.onChange}
              inForm
            />
            <Form.Message />
          </Form.Item>
        )}
      />
      <Form.Field
        name="paymentPlan.installment"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>installment</Form.Label>
            <Input
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
              type="number"
            />
            <Form.Message />
          </Form.Item>
        )}
      />
    </>
  );
};
