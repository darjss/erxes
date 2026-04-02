import { ActivityLogCustomActivity, ActivityLogs, TActivityLog } from 'ui-modules';

const PropertyRowsActivitySentence = ({
  activity,
}: {
  activity: TActivityLog;
}) => {
  const { changes, metadata } = activity;
  const fieldLabel = metadata?.fieldLabel || 'Property Rows';
  const prev: any[] = changes?.prev?.propertyRows ?? [];
  const current: any[] = changes?.current?.propertyRows ?? [];

  const prevCount = Array.isArray(prev) ? prev.length : 0;
  const currentCount = Array.isArray(current) ? current.length : 0;

  return (
    <>
      <ActivityLogs.ActorName activity={activity} />
      <span className="text-muted-foreground">changed</span>
      <span className="font-medium">{fieldLabel.toLowerCase()}</span>
      <span className="text-muted-foreground">
        ({prevCount} → {currentCount} rows)
      </span>
    </>
  );
};

export const propertyRowsActivityLog: ActivityLogCustomActivity = {
  type: 'oppty.propertyrows_changed',
  render: (activity: TActivityLog) => (
    <div className="flex flex-col gap-1">
      <div className="text-sm text-foreground flex flex-row gap-1 flex-wrap items-center">
        <PropertyRowsActivitySentence activity={activity} />
      </div>
    </div>
  ),
};
