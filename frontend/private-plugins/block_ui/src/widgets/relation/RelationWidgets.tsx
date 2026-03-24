import { Suspense, lazy } from 'react';

import type { IRelationWidgetProps } from 'ui-modules';

const Oppty = lazy(() =>
  import('./modules/Oppty').then((module) => ({
    default: module.Oppty,
  })),
);

export const RelationWidgets = ({
  module,
  contentId,
  contentType,
  customerId,
  companyId,
}: IRelationWidgetProps) => {
  return (
    <Suspense>
      {module === 'oppty' ? (
        <Oppty
          contentId={contentId}
          contentType={contentType}
          customerId={customerId}
          companyId={companyId}
        />
      ) : null}
    </Suspense>
  );
};

export default RelationWidgets;
