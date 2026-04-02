import {
  ActivityLogInput,
  activityBuilder,
  Config,
} from 'erxes-api-shared/core-modules';

const OPPTY_ACTIVITY_FIELDS = [
  { field: 'status', label: 'Status' },
  { field: 'assignedUserId', label: 'Assigned User' },
  { field: 'description', label: 'Description' },
  { field: 'startDate', label: 'Start Date' },
  { field: 'targetDate', label: 'Target Date' },
  { field: 'customerSource', label: 'Customer Source' },
  { field: 'unitType', label: 'Unit Type' },
] as const;

const buildOpptyTarget = (oppty: any) => ({
  _id: oppty._id,
  moduleName: 'block',
  collectionName: 'block_opptys',
  text: oppty.number || String(oppty._id),
});

const getFieldLabel = (field: string): string => {
  const match = OPPTY_ACTIVITY_FIELDS.find((f) => f.field === field);
  return match?.label || field;
};

const OPPTY_ACTIVITY_CONFIG: Config<ActivityLogInput> = {
  commonFields: OPPTY_ACTIVITY_FIELDS.map(({ field }) => field),
  resolvers: {
    $default: ({ field, prev, current }, ctx) => {
      console.log(
        'Generating activity for field:',
        field,
        { prev, current },
        ctx,
      );
      if (!field) return [];
      const fieldLabel = getFieldLabel(field);
      return [
        {
          activityType: 'oppty.field_changed',
          target: buildOpptyTarget(ctx.oppty),
          action: {
            type: 'oppty.field_changed',
            description: `changed ${fieldLabel.toLowerCase()}`,
          },
          changes: { prev: { [field]: prev }, current: { [field]: current } },
          metadata: { field, fieldLabel },
        },
      ];
    },
  },
  buildTarget: (document) => buildOpptyTarget(document),
};

export async function generateOpptyUpdateActivityLogs(
  prevDocument: any,
  currentDocument: any,
  createActivityLog: (
    activities: ActivityLogInput | ActivityLogInput[],
  ) => void,
): Promise<void> {
  try {
    const activities = await activityBuilder(
      prevDocument,
      currentDocument,
      OPPTY_ACTIVITY_CONFIG,
      { oppty: currentDocument },
    );
    if (activities.length > 0) {
      createActivityLog(activities);
    }
  } catch (error) {
    console.error('Failed to generate oppty activity logs', error);
  }
}
