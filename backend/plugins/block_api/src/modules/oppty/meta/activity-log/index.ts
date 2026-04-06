import {
  ActivityLogInput,
  activityBuilder,
  Config,
} from 'erxes-api-shared/core-modules';
import { IPropertyRow } from '@/oppty/@types/oppty';

const OPPTY_ACTIVITY_FIELDS = [
  { field: 'status', label: 'Status' },
  { field: 'assignedUserId', label: 'Assigned User' },
  { field: 'description', label: 'Description' },
  { field: 'startDate', label: 'Start Date' },
  { field: 'targetDate', label: 'Target Date' },
  { field: 'customerSource', label: 'Customer Source' },
  { field: 'unitType', label: 'Unit Type' },
  { field: 'tenureType', label: 'Tenure Type' },
  { field: 'propertyRows', label: 'Property Rows' },
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
    status: ({ field, prev, current }, ctx) => {
      if (!field) return [];
      const fieldLabel = getFieldLabel(field);
      return [
        {
          activityType: 'oppty.status_changed',
          target: buildOpptyTarget(ctx.oppty),
          action: {
            type: 'oppty.status_changed',
            description: `changed ${fieldLabel.toLowerCase()}`,
          },
          changes: { prev: { [field]: prev }, current: { [field]: current } },
          metadata: { field, fieldLabel },
        },
      ];
    },
    unitType: ({ field, prev, current }, ctx) => {
      if (!field) return [];
      const fieldLabel = getFieldLabel(field);
      return [
        {
          activityType: 'oppty.unittype_changed',
          target: buildOpptyTarget(ctx.oppty),
          action: {
            type: 'oppty.unittype_changed',
            description: `changed ${fieldLabel.toLowerCase()}`,
          },
          changes: { prev: { [field]: prev }, current: { [field]: current } },
          metadata: { field, fieldLabel },
        },
      ];
    },
    propertyRows: ({ field, prev, current }, ctx) => {
      if (!field) return [];

      const prevRows: IPropertyRow[] = Array.isArray(prev) ? prev : [];
      const currRows: IPropertyRow[] = Array.isArray(current) ? current : [];
      const target = buildOpptyTarget(ctx.oppty);
      const activities: ActivityLogInput[] = [];

      // Rows newly added (buildingId in current but not in prev)
      const newRows = currRows.filter(
        (c) =>
          c.buildingId && !prevRows.some((p) => p.buildingId === c.buildingId),
      );
      // Rows fully removed (buildingId in prev but not in current)
      const deletedRows = prevRows.filter(
        (p) =>
          p.buildingId && !currRows.some((c) => c.buildingId === p.buildingId),
      );
      // Rows that exist in both — detect field-level changes within the row
      const updatedPairs = prevRows
        .filter(
          (p) =>
            p.buildingId && currRows.some((c) => c.buildingId === p.buildingId),
        )
        .map((p) => ({
          prev: p,
          curr: currRows.find((c) => c.buildingId === p.buildingId),
        }));

      // New block selected
      for (const row of newRows) {
        activities.push({
          activityType: 'oppty.block_selected',
          target,
          action: {
            type: 'oppty.block_selected',
            description: 'selected block',
          },
          changes: { prev: null, current: row },
          metadata: { field, buildingId: row.buildingId },
        });
        // If zone was also set in the same update
        if (row.zoningId) {
          activities.push({
            activityType: 'oppty.zone_selected',
            target,
            action: {
              type: 'oppty.zone_selected',
              description: 'selected zone',
            },
            changes: { prev: null, current: row },
            metadata: {
              field,
              buildingId: row.buildingId,
              zoningId: row.zoningId,
            },
          });
        }
        // If unit was also set in the same update
        if (row.unitId) {
          activities.push({
            activityType: 'oppty.unit_added',
            target,
            action: { type: 'oppty.unit_added', description: 'added unit' },
            changes: { prev: null, current: row },
            metadata: {
              field,
              buildingId: row.buildingId,
              zoningId: row.zoningId,
              unitId: row.unitId,
            },
          });
        }
      }

      // Block row removed
      for (const row of deletedRows) {
        activities.push({
          activityType: 'oppty.block_removed',
          target,
          action: { type: 'oppty.block_removed', description: 'removed block' },
          changes: { prev: row, current: null },
          metadata: {
            field,
            buildingId: row.buildingId,
            zoningId: row.zoningId,
            unitId: row.unitId,
          },
        });
      }

      // Within existing rows: detect zone / unit selection changes
      for (const { prev: p, curr: c } of updatedPairs) {
        if (!c) continue;
        if (!p.zoningId && c.zoningId) {
          activities.push({
            activityType: 'oppty.zone_selected',
            target,
            action: {
              type: 'oppty.zone_selected',
              description: 'selected zone',
            },
            changes: { prev: p, current: c },
            metadata: { field, buildingId: c.buildingId, zoningId: c.zoningId },
          });
        } else if (p.zoningId && !c.zoningId) {
          activities.push({
            activityType: 'oppty.zone_removed',
            target,
            action: { type: 'oppty.zone_removed', description: 'removed zone' },
            changes: { prev: p, current: c },
            metadata: { field, buildingId: p.buildingId, zoningId: p.zoningId },
          });
        }

        if (!p.unitId && c.unitId) {
          activities.push({
            activityType: 'oppty.unit_added',
            target,
            action: { type: 'oppty.unit_added', description: 'added unit' },
            changes: { prev: p, current: c },
            metadata: {
              field,
              buildingId: c.buildingId,
              zoningId: c.zoningId,
              unitId: c.unitId,
            },
          });
        } else if (p.unitId && !c.unitId) {
          activities.push({
            activityType: 'oppty.unit_removed',
            target,
            action: { type: 'oppty.unit_removed', description: 'removed unit' },
            changes: { prev: p, current: c },
            metadata: {
              field,
              buildingId: p.buildingId,
              zoningId: p.zoningId,
              unitId: p.unitId,
            },
          });
        }
      }

      // Main unit changed
      const prevMain = prevRows.find((p) => p.isMain);
      const currMain = currRows.find((c) => c.isMain);
      const mainUnitChanged =
        currMain?.unitId !== prevMain?.unitId &&
        (currMain?.unitId || prevMain?.unitId);

      if (mainUnitChanged) {
        if (currMain) {
          activities.push({
            activityType: 'oppty.main_unit_set',
            target,
            action: {
              type: 'oppty.main_unit_set',
              description: 'chosen main unit',
            },
            changes: { prev: prevMain || null, current: currMain },
            metadata: {
              field,
              unitId: currMain.unitId,
              buildingId: currMain.buildingId,
              zoningId: currMain.zoningId,
              prevUnitId: prevMain?.unitId || null,
            },
          });
        } else if (prevMain) {
          activities.push({
            activityType: 'oppty.main_unit_removed',
            target,
            action: {
              type: 'oppty.main_unit_removed',
              description: 'removed main unit',
            },
            changes: { prev: prevMain, current: null },
            metadata: {
              field,
              unitId: prevMain.unitId,
              buildingId: prevMain.buildingId,
              zoningId: prevMain.zoningId,
            },
          });
        }
      }

      return activities;
    },
    tenureType: ({ field, prev, current }, ctx) => {
      if (!field) return [];
      const fieldLabel = getFieldLabel(field);
      return [
        {
          activityType: 'oppty.tenuretype_changed',
          target: buildOpptyTarget(ctx.oppty),
          action: {
            type: 'oppty.tenuretype_changed',
            description: `changed ${fieldLabel.toLowerCase()}`,
          },
          changes: { prev: { [field]: prev }, current: { [field]: current } },
          metadata: { field, fieldLabel },
        },
      ];
    },
    $default: ({ field, prev, current }, ctx) => {
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
