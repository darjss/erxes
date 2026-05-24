import { useTranslation } from 'react-i18next';

type Props = {
  customers: any;
  action: string;
};

const CustomersRow = ({ customers, action }: Props) => {
  const { t } = useTranslation('mongolian');
  const { Name, No, primaryName, firstName, code, syncStatus } = customers;

  const displayCode = action === 'DELETE' ? code : No;
  const displayName = action === 'DELETE' ? primaryName || firstName : Name;

  return (
    <tr className="border-b">
      <td className="p-2">{displayCode}</td>
      <td className="p-2">{displayName}</td>

      <td className="p-2">
        {syncStatus !== false && (
          <span className="text-green-600 font-medium">{t('synced')}</span>
        )}
      </td>
    </tr>
  );
};

export default CustomersRow;
