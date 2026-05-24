import { useState } from 'react';
import { Button, Label, DatePicker, Select } from 'erxes-ui';
import { useTranslation } from 'react-i18next';
import { IExchangeRate, ExchangeRateFormValues } from '../types';

type Props = {
  exchangeRate?: IExchangeRate;
  currencies: string[];
  submitting?: boolean;
  onSubmit: (values: ExchangeRateFormValues) => void;
};

const ExchangeRateForm = ({
  exchangeRate,
  currencies,
  submitting,
  onSubmit,
}: Props) => {
  const { t } = useTranslation('mongolian');
  const [date, setDate] = useState<Date>(exchangeRate?.date ?? new Date());

  const [mainCurrency, setMainCurrency] = useState<string>(
    exchangeRate?.mainCurrency ?? '',
  );

  const [rateCurrency, setRateCurrency] = useState<string>(
    exchangeRate?.rateCurrency ?? '',
  );

  const [rate, setRate] = useState<number>(exchangeRate?.rate ?? 0);

  const handleSubmit = () => {
    const values: ExchangeRateFormValues = {
      _id: exchangeRate?._id,
      date,
      mainCurrency,
      rateCurrency,
      rate,
    };

    onSubmit(values);
  };

  return (
    <div className="space-y-4">
      {/* Start Date */}
      <div>
        <Label>{t('start-date')}</Label>
        <DatePicker
          value={date}
          format="YYYY-MM-DD"
          onChange={(d) => d instanceof Date && setDate(d)}
        />
      </div>

      {/* Main Currency */}
      <div>
        <Label>{t('main-currency')}</Label>
        <Select value={mainCurrency} onValueChange={setMainCurrency}>
          <Select.Trigger>
            <Select.Value placeholder={t('choose-main-currency')} />
          </Select.Trigger>
          <Select.Content>
            {currencies.map((currency) => (
              <Select.Item key={currency} value={currency}>
                {currency}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>

      {/* Rate Currency */}
      <div>
        <Label>{t('rate-currency')}</Label>
        <Select value={rateCurrency} onValueChange={setRateCurrency}>
          <Select.Trigger>
            <Select.Value placeholder={t('choose-rate-currency')} />
          </Select.Trigger>
          <Select.Content>
            {currencies.map((currency) => (
              <Select.Item key={currency} value={currency}>
                {currency}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>

      {/* Rate */}
      <div>
        <Label>{t('rate')}</Label>
        <input
          type="number"
          className="h-8 w-full rounded border px-3 text-sm"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => window.history.back()}
        >
          {t('close')}
        </Button>

        <Button type="button" onClick={handleSubmit} disabled={submitting}>
          {t('save')}
        </Button>
      </div>
    </div>
  );
};

export default ExchangeRateForm;
