import { useState, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

import { Button } from 'erxes-ui';
import { useTranslation } from 'react-i18next';
import { IExchangeRate } from '../types';

type Props = {
  rateList: IExchangeRate[];
  totalCount: number;
  loading: boolean;
  deleteExchangeRates: (ids: string[], cb: () => void) => void;
  queryParams: Record<string, string>;
};

const ExchangeRates = ({
  rateList,
  totalCount,
  loading,
  deleteExchangeRates,
  queryParams,
}: Props) => {
  const { t } = useTranslation('mongolian');
  const navigate = useNavigate();
  const location = useLocation();

  const [searchValue, setSearchValue] = useState(queryParams.searchValue ?? '');

  /* ---------------- search ---------------- */

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    const params = new URLSearchParams(location.search);

    if (value) {
      params.set('searchValue', value);
    } else {
      params.delete('searchValue');
    }

    navigate(`${location.pathname}?${params.toString()}`);
  };

  /* ---------------- actions ---------------- */

  const goCreate = () => {
    console.log('CLICKED');
    navigate('/settings/mongolian/exchange-rates/create');
  };

  const goEdit = (id: string) => {
    navigate(`/settings/mongolian/exchange-rates/${id}`);
  };

  const remove = (id: string) => {
    deleteExchangeRates([id], () => {});
  };

  /* ---------------- render ---------------- */

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('exchange-rates', { count: totalCount })}</h2>

        <div className="flex gap-2">
          <input
            className="h-8 rounded border px-2 text-sm"
            placeholder={t('type-to-search')}
            value={searchValue}
            onChange={onSearch}
          />

          <Button type="button" variant="default" onClick={goCreate}>
            {t('add-exchange-rate')}
          </Button>
        </div>
      </div>

      {loading ? (
        <div>{t('loading')}</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">{t('date')}</th>
              <th>{t('main-currency')}</th>
              <th>{t('rate-currency')}</th>
              <th>{t('rate')}</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {rateList.map((rate) => (
              <tr key={rate._id} className="border-b">
                <td className="py-2">
                  {dayjs(rate.date).format('YYYY-MM-DD')}
                </td>
                <td>{rate.mainCurrency}</td>
                <td>{rate.rateCurrency}</td>
                <td>{rate.rate}</td>
                <td className="flex gap-2">
                  <Button variant="ghost" onClick={() => goEdit(rate._id!)}>
                    {t('edit')}
                  </Button>

                  <Button variant="ghost" onClick={() => remove(rate._id!)}>
                    {t('delete')}
                  </Button>
                </td>
              </tr>
            ))}

            {!rateList.length && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  {t('no-exchange-rates-found')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExchangeRates;
