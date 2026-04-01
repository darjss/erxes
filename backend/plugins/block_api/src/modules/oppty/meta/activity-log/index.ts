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
  assignmentFields: ['labelIds', 'tagIds'],
  commonFields: OPPTY_ACTIVITY_FIELDS.map(({ field }) => field),
  resolvers: {
    $default: ({ field, prev, current }, ctx) => {
      if (!field) return [];
      const fieldLabel = getFieldLabel(field);
      return [
        {
          activityType: 'block.oppty.field_changed',
          target: buildOpptyTarget(ctx.oppty),
          action: {
            type: 'block.oppty.field_changed',
            description: `changed ${fieldLabel.toLowerCase()}`,
          },
          changes: { prev: { [field]: prev }, current: { [field]: current } },
          metadata: { field, fieldLabel },
        },
      ];
    },
    labelIds: ({ added = [], removed = [] }, ctx) => {
      const activities: ActivityLogInput[] = [];
      if (added.length) {
        activities.push({
          activityType: 'block.oppty.label_assigned',
          target: buildOpptyTarget(ctx.oppty),
          action: { type: 'block.oppty.label_assigned', description: 'assigned label' },
          changes: { added: { ids: added } },
          metadata: { entityLabel: 'label' },
        });
      }
      if (removed.length) {
        activities.push({
          activityType: 'block.oppty.label_unassigned',
          target: buildOpptyTarget(ctx.oppty),
          action: { type: 'block.oppty.label_unassigned', description: 'removed label' },
          changes: { removed: { ids: removed } },
          metadata: { entityLabel: 'label' },
        });
      }
      return activities;
    },
    tagIds: ({ added = [], removed = [] }, ctx) => {
      const activities: ActivityLogInput[] = [];
      if (added.length) {
        activities.push({
          activityType: 'block.oppty.tag_added',
          target: buildOpptyTarget(ctx.oppty),
          action: { type: 'block.oppty.tag_added', description: 'added tag' },
          changes: { added: { ids: added } },
          metadata: { entityLabel: 'tag' },
        });
      }
      if (removed.length) {
        activities.push({
          activityType: 'block.oppty.tag_removed',
          target: buildOpptyTarget(ctx.oppty),
          action: { type: 'block.oppty.tag_removed', description: 'removed tag' },
          changes: { removed: { ids: removed } },
          metadata: { entityLabel: 'tag' },
        });
      }
      return activities;
    },
  },
  buildTarget: (document) => buildOpptyTarget(document),
};

export async function generateOpptyUpdateActivityLogs(
  prevDocument: any,
  currentDocument: any,
  createActivityLog: (activities: ActivityLogInput | ActivityLogInput[]) => void,
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
