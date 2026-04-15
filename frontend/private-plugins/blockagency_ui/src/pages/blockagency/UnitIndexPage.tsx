import { useState } from 'react';
import { UnitKPI } from '~/modules/unit/components/UnitKPI';
import { UnitRecordTable } from '~/modules/unit/components/UnitRecordTable';
import { BlockUnitStatus } from '~/modules/unit/types/unit';

type StatusFilter = BlockUnitStatus | 'all';

export const UnitIndexPage = () => {
  const [status, setStatus] = useState<StatusFilter>('all');

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <UnitKPI activeStatus={status} onStatusChange={setStatus} />
      <UnitRecordTable status={status === 'all' ? undefined : status} />
    </div>
  );
};
