import {
  ActivityLogInput,
  activityBuilder,
  Config,
} from 'erxes-api-shared/core-modules';

const PROJECT_ACTIVITY_FIELDS = [
  { field: 'name', label: 'Name' },
  { field: 'status', label: 'Status' },
  { field: 'verificationStatus', label: 'Verification Status' },
  { field: 'isPublished', label: 'Published' },
  { field: 'startDate', label: 'Start Date' },
  { field: 'endDate', label: 'End Date' },
] as const;

const buildProjectTarget = (project: any) => ({
  _id: project._id,
  moduleName: 'block',
  collectionName: 'block_projects',
  text: project.name || String(project._id),
});

const getFieldLabel = (field: string): string => {
  const match = PROJECT_ACTIVITY_FIELDS.find((f) => f.field === field);
  return match?.label || field;
};

const PROJECT_ACTIVITY_CONFIG: Config<ActivityLogInput> = {
  assignmentFields: [],
  commonFields: PROJECT_ACTIVITY_FIELDS.map(({ field }) => field),
  resolvers: {
    $default: ({ field, prev, current }, ctx) => {
      if (!field) return [];
      const fieldLabel = getFieldLabel(field);
      return [
        {
          activityType: 'block.project.field_changed',
          target: buildProjectTarget(ctx.project),
          action: {
            type: 'block.project.field_changed',
            description: `changed ${fieldLabel.toLowerCase()}`,
          },
          changes: { prev: { [field]: prev }, current: { [field]: current } },
          metadata: { field, fieldLabel },
        },
      ];
    },
  },
  buildTarget: (document) => buildProjectTarget(document),
};

export async function generateProjectUpdateActivityLogs(
  prevDocument: any,
  currentDocument: any,
  createActivityLog: (activities: ActivityLogInput | ActivityLogInput[]) => void,
): Promise<void> {
  try {
    const activities = await activityBuilder(
      prevDocument,
      currentDocument,
      PROJECT_ACTIVITY_CONFIG,
      { project: currentDocument },
    );
    if (activities.length > 0) {
      createActivityLog(activities);
    }
  } catch (error) {
    console.error('Failed to generate project activity logs', error);
  }
}
