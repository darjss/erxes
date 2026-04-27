import { IconCarSuv } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { NavigationMenuLinkItem } from 'erxes-ui';

export const MainNavigation = () => {
  const { t } = useTranslation('car');

  return (
    <NavigationMenuLinkItem
      name={t('Cars', { defaultValue: 'Cars' })}
      path="cars"
      icon={IconCarSuv}
    />
  );
};
