import {
  ActivityLogInput,
  activityBuilder,
  Config,
} from 'erxes-api-shared/core-modules';

const DEVELOPER_ACTIVITY_FIELDS = [
  { field: 'name', label: 'Name' },
  { field: 'verificationStatus', label: 'Verification Status' },
  { field: 'primaryEmail', label: 'Primary Email' },
  { field: 'primaryPhone', label: 'Primary Phone' },
] as const;

const buildDeveloperTarget = (developer: any) => ({
  _id: developer._id,
  moduleName: 'block',
  collectionName: 'block_developers',
  text: developer.name || String(developer._id),
});

const getFieldLabel = (field: string): string => {
  const match = DEVELOPER_ACTIVITY_FIELDS.find((f) => f.field === field);
  return match?.label || field;
};

const DEVELOPER_ACTIVITY_CONFIG: Config<ActivityLogInput> = {
  assignmentFields: [],
  commonFields: DEVELOPER_ACTIVITY_FIELDS.map(({ field }) => field),
  resolvers: {
    $default: ({ field, prev, current }, ctx) => {
      if (!field) return [];
      const fieldLabel = getFieldLabel(field);
      return [
        {
          activityType: 'block.developer.field_changed',
          target: buildDeveloperTarget(ctx.developer),
          action: {
            type: 'block.developer.field_changed',
            description: `changed ${fieldLabel.toLowerCase()}`,
          },
          changes: { prev: { [field]: prev }, current: { [field]: current } },
          metadata: { field, fieldLabel },
        },
      ];
    },
  },
  buildTarget: (document) => buildDeveloperTarget(document),
};

export async function generateDeveloperUpdateActivityLogs(
  prevDocument: any,
  currentDocument: any,
  createActivityLog: (activities: ActivityLogInput | ActivityLogInput[]) => void,
): Promise<void> {
  try {
    const activities = await activityBuilder(
      prevDocument,
      currentDocument,
      DEVELOPER_ACTIVITY_CONFIG,
      { developer: currentDocument },
    );
    if (activities.length > 0) {
      createActivityLog(activities);
    }
  } catch (error) {
    console.error('Failed to generate developer activity logs', error);
  }
}
