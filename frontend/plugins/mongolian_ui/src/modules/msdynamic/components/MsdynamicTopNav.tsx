import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const tabs = [
  { label: 'sync-history', value: 'sync-history' },
  { label: 'check-orders', value: 'synced-orders' },
  { label: 'check-categories', value: 'categories' },
  { label: 'check-products', value: 'products' },
  { label: 'check-price', value: 'prices' },
  { label: 'check-customers', value: 'customers' },
];

const MsdynamicTopNav = () => {
  const { t } = useTranslation('mongolian');
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: 24, padding: '0 20px' }}>
        {tabs.map((tab) => {
          const isActive = currentPath.includes(tab.value);

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => navigate(`/mongolian/msdynamic/${tab.value}`)}
              style={{
                cursor: 'pointer',
                padding: '12px 0',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#5c6ac4' : '#6b7280',
                borderBottom: isActive
                  ? '2px solid #5c6ac4'
                  : '2px solid transparent',
                whiteSpace: 'nowrap',
                background: 'none',
                border: 'none',
              }}
            >
              {t(tab.label)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MsdynamicTopNav;
