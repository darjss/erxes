import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type Props = {
  order: any;
};

const OrderDetail = ({ order }: Props) => {
  const { t } = useTranslation('mongolian');
  const formatAmount = (value: number) => (value || 0).toLocaleString();

  const renderRow = (label: string, value: React.ReactNode) => (
    <div className="flex justify-between py-2 border-b text-sm">
      <span className="font-medium text-muted-foreground">{label}</span>
      <span>{value || '-'}</span>
    </div>
  );

  const generateCustomerLabel = (customer: any) => {
    if (!customer) return '';

    const { firstName, lastName, primaryPhone, primaryEmail } = customer;

    let value = firstName ? firstName.toUpperCase() : '';

    if (lastName) value += ` ${lastName}`;
    if (primaryPhone) value += ` (${primaryPhone})`;
    if (primaryEmail) value += ` /${primaryEmail}/`;

    return value;
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-2">
        {renderRow(
          (order.customerType || 'Customer').toUpperCase(),
          order.customer ? generateCustomerLabel(order.customer) : '',
        )}

        {renderRow(t('bill-number'), order.number)}

        {renderRow(
          t('date'),
          dayjs(order.paidDate || order.createdAt).format('LLL'),
        )}

        {order.deliveryInfo &&
          renderRow(t('delivery-info'), order.deliveryInfo.description)}

        {order.syncErkhetInfo && renderRow(t('erkhet-info'), order.syncErkhetInfo)}

        {order.convertDealId &&
          renderRow(
            t('deal'),
            <Link to={order.dealLink || ''} className="text-primary underline">
              {order.deal?.name || t('deal')}
            </Link>,
          )}
      </div>

      {/* Ebarimt Responses */}
      {(order.putResponses || []).map((p: any) => (
        <div key={p.billId} className="space-y-1">
          {renderRow(t('bill-id'), p.billId)}
          {renderRow(t('ebarimt-date'), dayjs(p.date).format('LLL'))}
        </div>
      ))}

      {/* Items Table */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b">
            <tr>
              <th className="p-2 text-left">{t('product')}</th>
              <th className="p-2 text-left">{t('count')}</th>
              <th className="p-2 text-left">{t('unit-price')}</th>
              <th className="p-2 text-left">{t('amount')}</th>
              <th className="p-2 text-left">{t('discount')}</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item: any) => (
              <tr key={item._id} className="border-b">
                <td className="p-2">{item.productName}</td>
                <td className="p-2">{item.count}</td>
                <td className="p-2">{formatAmount(item.unitPrice)}</td>
                <td className="p-2">
                  {formatAmount(item.count * item.unitPrice)}
                </td>
                <td className="p-2">{formatAmount(item.discountAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="space-y-2">
        {renderRow(t('total-amount'), formatAmount(order.totalAmount))}
      </div>

      {/* Editable Amounts */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm">{t('payment-breakdown')}</h4>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>{t('cash-amount')}</span>
            <input
              type="number"
              value={order.cashAmount || 0}
              className="border rounded px-2 py-1 text-sm w-32"
              readOnly
            />
          </div>

          <div className="flex justify-between items-center">
            <span>{t('mobile-amount')}</span>
            <input
              type="number"
              value={order.mobileAmount || 0}
              className="border rounded px-2 py-1 text-sm w-32"
              readOnly
            />
          </div>

          {(order.paidAmounts || []).map((paid: any) => (
            <div key={paid._id} className="flex justify-between items-center">
              <span>{paid.type}</span>
              <input
                type="number"
                value={paid.amount || 0}
                className="border rounded px-2 py-1 text-sm w-32"
                readOnly
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
