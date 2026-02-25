import { CreditConsumptionReport } from '~/modules/booking/components/CreditConsumptionReport';
import { OneFitPageLayout } from '~/components/OneFitPageLayout';

export function CreditConsumptionPage() {
  return (
    <OneFitPageLayout pageName="Credit Consumption">
      <CreditConsumptionReport />
    </OneFitPageLayout>
  );
}

