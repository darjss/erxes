import { AccountStatementReport } from '~/modules/provider/components/AccountStatementReport';
import { OneFitPageLayout } from '~/components/OneFitPageLayout';

export function AccountStatementPage() {
  return (
    <OneFitPageLayout pageName="Account Statement">
      <AccountStatementReport />
    </OneFitPageLayout>
  );
}
