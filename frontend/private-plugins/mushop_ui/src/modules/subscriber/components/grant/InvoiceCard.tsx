import { InfoCard } from 'erxes-ui';
import { GrantSheetState } from '../../hooks/useGrantSheetState';
import { formatMoney } from '../../utils/grantHelpers';
import { CustomerName } from './CustomerName';
import { Row } from './Row';

export const InvoiceCard = ({
  customerId,
  amount,
  selectedPlan,
  selectedPayment,
}: Pick<
  GrantSheetState,
  'customerId' | 'amount' | 'selectedPlan' | 'selectedPayment'
>) => {
  if (!selectedPlan || !selectedPayment) return null;

  return (
    <InfoCard title="Invoice" className="flex-1">
      <InfoCard.Content>
        <div className="flex flex-col text-sm">
          <Row label="Description">{selectedPlan.name}</Row>
          <Row label="Customer">
            {customerId ? (
              <CustomerName customerId={customerId} />
            ) : (
              '—'
            )}
          </Row>
          <Row label="Content">
            <span className="font-mono text-sm">mushop:subscription</span>
          </Row>
          <Row label="Payment">
            {selectedPayment.name}
            <span className="ml-1 text-muted-foreground text-sm">
              ({selectedPayment.kind})
            </span>
          </Row>
          <Row label="Amount">
            <span className="font-semibold">
              {formatMoney(
                amount === '' ? selectedPlan.price : Number(amount),
                selectedPlan.currency,
              )}
            </span>
          </Row>
          <Row label="Status">
            <span className="inline-flex items-center gap-1.5 bg-emerald-100 px-2 py-0.5 rounded-full font-medium text-emerald-700 text-sm">
              <span className="bg-emerald-500 rounded-full w-1.5 h-1.5" />
              paid
            </span>
          </Row>
        </div>
      </InfoCard.Content>
    </InfoCard>
  );
};
