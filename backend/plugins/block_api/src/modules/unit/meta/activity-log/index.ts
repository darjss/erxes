import {
  ActivityLogInput,
  activityBuilder,
  Config,
} from 'erxes-api-shared/core-modules';

const UNIT_ACTIVITY_FIELDS = [
  { field: 'status', label: 'Status' },
  { field: 'type', label: 'Type' },
] as const;

const buildUnitTarget = (unit: any) => ({
  _id: unit._id,
  moduleName: 'block',
  collectionName: 'block_units',
  text: unit.number || String(unit._id),
});

const getFieldLabel = (field: string): string => {
  const match = UNIT_ACTIVITY_FIELDS.find((f) => f.field === field);
  return match?.label || field;
};

const UNIT_ACTIVITY_CONFIG: Config<ActivityLogInput> = {
  assignmentFields: [],
  commonFields: UNIT_ACTIVITY_FIELDS.map(({ field }) => field),
  resolvers: {
    $default: ({ field, prev, current }, ctx) => {
      if (!field) return [];
      const fieldLabel = getFieldLabel(field);
      return [
        {
          activityType: 'block.unit.field_changed',
          target: buildUnitTarget(ctx.unit),
          action: {
            type: 'block.unit.field_changed',
            description: `changed ${fieldLabel.toLowerCase()}`,
          },
          changes: { prev: { [field]: prev }, current: { [field]: current } },
          metadata: { field, fieldLabel },
        },
      ];
    },
  },
  buildTarget: (document) => buildUnitTarget(document),
};

export async function generateUnitUpdateActivityLogs(
  prevDocument: any,
  currentDocument: any,
  createActivityLog: (activities: ActivityLogInput | ActivityLogInput[]) => void,
): Promise<void> {
  try {
    const activities = await activityBuilder(
      prevDocument,
      currentDocument,
      UNIT_ACTIVITY_CONFIG,
      { unit: currentDocument },
    );
    if (activities.length > 0) {
      createActivityLog(activities);
    }
  } catch (error) {
    console.error('Failed to generate unit activity logs', error);
  }
}
