import { StackingDisplay } from 'frontend/private-plugins/blockadmin_ui/src/modules/stacking/components/StackingDisplay';
import { StackingLayout } from 'frontend/private-plugins/blockadmin_ui/src/modules/stacking/components/StackingLayout';

export const StackingPlanPage = () => {
  return (
    <StackingLayout>
      <StackingDisplay />
    </StackingLayout>
  );
};
