import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SettingSideBar = () => {
  const { t } = useTranslation('mongolian');
  return (
    <div className="w-64 border-r bg-background p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">{t('ms-dynamics')}</h2>
      </div>

      <nav className="space-y-2">
        <NavLink
          to="/mongolian/msdynamic"
          className={({ isActive }) =>
            `block rounded-md px-3 py-2 text-sm transition ${
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted'
            }`
          }
        >
          {t('general-config')}
        </NavLink>
      </nav>
    </div>
  );
};

export default SettingSideBar;
