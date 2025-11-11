import { PaymentPlans } from 'frontend/private-plugins/blockadmin_ui/src/modules/pricing/components/PaymentPlans';
import { ProjectBankPartners } from 'frontend/private-plugins/blockadmin_ui/src/modules/project/components/ProjectBankPartners';
import { ProjectPrice } from 'frontend/private-plugins/blockadmin_ui/src/modules/project/components/ProjectPrice';

export const ProjectDetailPrices = () => {
  return (
    <div className="p-8 grid-cols-2 grid gap-6">
      <ProjectPrice />
      <ProjectBankPartners />
      <PaymentPlans />
    </div>
  );
};
