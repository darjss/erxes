import {
  // ActivityLogCustomActivity,
  ActivityLogs,
  AddInternalNote,
  // TActivityLog,
} from 'ui-modules';

// export const status: ActivityLogCustomActivity = {
//   type: 'block.oppty.field_changed',
//   render: (activity: TActivityLog) => <div>12312</div>,
// };

export const OpptyActivityLog = ({ opptyId }: { opptyId: string }) => {
  return (
    <>
      <ActivityLogs
        targetId={opptyId}
        variant="backward"
        // customActivities={[status]}
      />

      <AddInternalNote contentTypeId={opptyId} contentType="block:oppty" />
    </>
  );
};
