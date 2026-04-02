import { InfoCard, Form, Input, Select, CurrencyField } from 'erxes-ui';
import { UseFormReturn } from 'react-hook-form';
import { IListing } from '../types/listing';
import { PRICING_TYPE } from '../constants/listing';

type Props = {
  form: UseFormReturn<IListing>;
};

export const ListingPricing: React.FC<Props> = ({ form }) => {
  const { control } = form;

  return (
    <InfoCard title="Pricing">
      <InfoCard.Content className="grid grid-cols-3 gap-4">
        <Form.Field<IListing, 'pricing.currency'>
          control={control}
          name="pricing.currency"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Currency</Form.Label>
              <Form.Control>
                <CurrencyField>
                  <CurrencyField.SelectCurrency {...field} />
                </CurrencyField>
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field<IListing, 'pricing.amount'>
          control={control}
          name="pricing.amount"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Amount</Form.Label>
              <Form.Control>
                <CurrencyField>
                  <CurrencyField.ValueInput
                    value={field.value}
                    onChange={(v) => field.onChange(v)}
                  />
                </CurrencyField>
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field<IListing, 'pricing.priceType'>
          control={control}
          name="pricing.priceType"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Price Type</Form.Label>
              <Form.Control>
                <Select value={field.value} onValueChange={field.onChange}>
                  <Select.Trigger>
                    <Select.Value placeholder="Select price type" />
                  </Select.Trigger>
                  <Select.Content>
                    {PRICING_TYPE.map((p) => (
                      <Select.Item key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
      </InfoCard.Content>
    </InfoCard>
  );
};
