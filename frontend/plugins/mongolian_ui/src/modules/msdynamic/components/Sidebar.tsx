import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { Button } from 'erxes-ui/components/button';
import { Input } from 'erxes-ui/components/input';
import { Label } from 'erxes-ui/components/label';
import { DatePicker } from 'erxes-ui/components/date-picker';

type Props = { queryParams: any };

const SideBar = ({ queryParams }: Props) => {
  const { t } = useTranslation('mongolian');
  const [filterParams, setFilterParams] = useState(queryParams);
  const location = useLocation();
  const navigate = useNavigate();

  const setFilter = (name: string, value: any) => {
    setFilterParams((prev: any) => ({ ...prev, [name]: value }));
  };

  const onSelectDate = (value: any, name: string) => {
    const strVal = moment(value).format('YYYY-MM-DD HH:mm');
    setFilter(name, strVal);
  };

  const runFilter = () => {
    const params = new URLSearchParams(filterParams);
    params.set('page', '1');
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold">{t('filters')}</h3>

      <div className="space-y-2">
        <Label>{t('user')}</Label>
        <Input
          value={filterParams.userId || ''}
          onChange={(e) => setFilter('userId', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>{t('start-date')}</Label>
        <DatePicker
          value={filterParams.startDate}
          onChange={(value) => onSelectDate(value, 'startDate')}
        />
      </div>

      <div className="space-y-2">
        <Label>{t('end-date')}</Label>
        <DatePicker
          value={filterParams.endDate}
          onChange={(value) => onSelectDate(value, 'endDate')}
        />
      </div>

      <Button onClick={runFilter} className="w-full">
        {t('filter')}
      </Button>
    </div>
  );
};

export default SideBar;
