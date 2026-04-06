import {
  ActivityLogInput,
  activityBuilder,
  Config,
} from 'erxes-api-shared/core-modules';

const UNIT_TYPE_ACTIVITY_FIELDS = [
  { field: 'name', label: 'Name' },
  { field: 'status', label: 'Status' },
  { field: 'price', label: 'Price' },
  { field: 'size', label: 'Size' },
] as const;

const buildUnitTypeTarget = (unitType: any) => ({
  _id: unitType._id,
  moduleName: 'block',
  collectionName: 'block_unit_types',
  text: unitType.name || String(unitType._id),
});

const getFieldLabel = (field: string): string => {
  const match = UNIT_TYPE_ACTIVITY_FIELDS.find((f) => f.field === field);
  return match?.label || field;
};

const UNIT_TYPE_ACTIVITY_CONFIG: Config<ActivityLogInput> = {
  assignmentFields: [],
  commonFields: UNIT_TYPE_ACTIVITY_FIELDS.map(({ field }) => field),
  resolvers: {
    $default: ({ field, prev, current }, ctx) => {
      if (!field) return [];
      const fieldLabel = getFieldLabel(field);
      return [
        {
          activityType: 'block.unit_type.field_changed',
          target: buildUnitTypeTarget(ctx.unitType),
          action: {
            type: 'block.unit_type.field_changed',
            description: `changed ${fieldLabel.toLowerCase()}`,
          },
          changes: { prev: { [field]: prev }, current: { [field]: current } },
          metadata: { field, fieldLabel },
        },
      ];
    },
  },
  buildTarget: (document) => buildUnitTypeTarget(document),
};

export async function generateUnitTypeUpdateActivityLogs(
  prevDocument: any,
  currentDocument: any,
  createActivityLog: (activities: ActivityLogInput | ActivityLogInput[]) => void,
): Promise<void> {
  try {
    const activities = await activityBuilder(
      prevDocument,
      currentDocument,
      UNIT_TYPE_ACTIVITY_CONFIG,
      { unitType: currentDocument },
    );
    if (activities.length > 0) {
      createActivityLog(activities);
    }
  } catch (error) {
    console.error('Failed to generate unit type activity logs', error);
  }
}
