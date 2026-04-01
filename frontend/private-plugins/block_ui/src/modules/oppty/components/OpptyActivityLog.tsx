import { ActivityLogs } from 'ui-modules';

export const OpptyActivityLog = ({ opptyId }: { opptyId: string }) => {
  return (
    <ActivityLogs
      targetId={opptyId}
      targetType="block:block.opptys"
      variant="backward"
    />
  );
};
