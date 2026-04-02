import { ActivityLogs, AddInternalNote } from 'ui-modules';
import { propertyRowsActivityLog } from './activity-status/PropertyRowsActivityLog';
import { statusActivityLog } from './activity-status/StatusActivityLog';
import { tenureTypeActivityLog } from './activity-status/TenureTypeActivityLog';
import { unitTypeActivityLog } from './activity-status/UnitTypeActivityLog';

const customActivities = [
  statusActivityLog,
  unitTypeActivityLog,
  tenureTypeActivityLog,
  propertyRowsActivityLog,
];

export const OpptyActivityLog = ({ opptyId }: { opptyId: string }) => {
  return (
    <>
      <ActivityLogs
        targetId={opptyId}
        variant="backward"
        customActivities={customActivities}
      />

      <AddInternalNote contentTypeId={opptyId} contentType="block:oppty" />
    </>
  );
};
