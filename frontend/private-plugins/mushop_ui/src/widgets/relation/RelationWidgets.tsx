import { Suspense } from 'react';
import type { IRelationWidgetProps } from 'ui-modules';
import { SubscriptionPlanWidget } from './SubscriptionPlanWidget';

export const RelationWidgets = ({
  module,
  contentId,
}: IRelationWidgetProps) => {
  return (
    <Suspense>
      {module === 'subscription_plan' && (
        <SubscriptionPlanWidget contentId={contentId} />
      )}
    </Suspense>
  );
};

export default RelationWidgets;
