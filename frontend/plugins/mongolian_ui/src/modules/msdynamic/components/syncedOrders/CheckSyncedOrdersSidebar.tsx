import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Button } from 'erxes-ui/components/button';
import { Input } from 'erxes-ui/components/input';
import { Label } from 'erxes-ui/components/label';
import { DatePicker } from 'erxes-ui/components/date-picker';

type Props = {
  queryParams: any;
};

const CheckSyncedOrdersSidebar = ({ queryParams }: Props) => {
  const { t } = useTranslation('mongolian');
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState({
    search: queryParams.search || '',
    paidStartDate: queryParams.paidStartDate || '',
    paidEndDate: queryParams.paidEndDate || '',
    createdStartDate: queryParams.createdStartDate || '',
    createdEndDate: queryParams.createdEndDate || '',
    userId: queryParams.user || '',
    brandId: queryParams.brandId || '',
  });

  const updateParam = (key: string, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilter = () => {
    if (!state.brandId) {
      alert(t('choose-brand'));
      return;
    }

    const params = new URLSearchParams();

    Object.entries(state).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value));
      }
    });

    params.set('page', '1');

    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-lg font-semibold">{t('filters')}</div>

      {/* Brand */}
      <div className="space-y-2">
        <Label>{t('brand')}</Label>
        <Input
          value={state.brandId}
          onChange={(e) => updateParam('brandId', e.target.value)}
          placeholder={t('brand-id')}
        />
      </div>

      {/* User */}
      <div className="space-y-2">
        <Label>{t('user')}</Label>
        <Input
          value={state.userId}
          onChange={(e) => updateParam('userId', e.target.value)}
          placeholder={t('user-id')}
        />
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label>{t('number')}</Label>
        <Input
          value={state.search}
          onChange={(e) => updateParam('search', e.target.value)}
          placeholder={t('search-number')}
        />
      </div>

      {/* Paid Date Range */}
      <div className="space-y-2">
        <Label>{t('paid-date-start')}</Label>
        <DatePicker
          value={
            state.paidStartDate ? new Date(state.paidStartDate) : undefined
          }
          onChange={(date) =>
            updateParam(
              'paidStartDate',
              date ? dayjs(date as Date).format('YYYY-MM-DD HH:mm') : '',
            )
          }
        />

        <Label>{t('paid-date-end')}</Label>
        <DatePicker
          value={state.paidEndDate ? new Date(state.paidEndDate) : undefined}
          onChange={(date) =>
            updateParam(
              'paidEndDate',
              date ? dayjs(date as Date).format('YYYY-MM-DD HH:mm') : '',
            )
          }
        />
      </div>

      {/* Created Date Range */}
      <div className="space-y-2">
        <Label>{t('created-date-start')}</Label>
        <DatePicker
          value={
            state.createdStartDate
              ? new Date(state.createdStartDate)
              : undefined
          }
          onChange={(date) =>
            updateParam(
              'createdStartDate',
              date ? dayjs(date as Date).format('YYYY-MM-DD HH:mm') : '',
            )
          }
        />

        <Label>{t('created-date-end')}</Label>
        <DatePicker
          value={
            state.createdEndDate ? new Date(state.createdEndDate) : undefined
          }
          onChange={(date) =>
            updateParam(
              'createdEndDate',
              date ? dayjs(date as Date).format('YYYY-MM-DD HH:mm') : '',
            )
          }
        />
      </div>

      <Button onClick={applyFilter} className="w-full">
        {t('apply-filter')}
      </Button>
    </div>
  );
};

export default CheckSyncedOrdersSidebar;
