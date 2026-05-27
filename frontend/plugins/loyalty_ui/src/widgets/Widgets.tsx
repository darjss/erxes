import { useTranslation } from 'react-i18next';

export const Widgets = ({
  module,
  contentId,
  contentType,
}: {
  module: any;
  contentId: string;
  contentType: string;
}) => {
  const { t } = useTranslation('loyalty');
  return <div>{t('pricing-widget')}</div>;
};

export default Widgets;
