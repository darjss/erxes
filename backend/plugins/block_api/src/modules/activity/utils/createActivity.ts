import { OPPTY_FIELDS } from '@/oppty/constants';
import { DEVELOPER_FIELDS } from '@/developer/constants';
import { PROJECT_FIELDS } from '@/project/constants';
import { UNIT_FIELDS, UNIT_TYPE_FIELDS } from '@/unit/constants';
import { subMinutes, isAfter } from 'date-fns';
import { generateModels } from '~/connectionResolvers';
import { BLOCK_MODULES } from '~/constants';

enum Action {
  CREATED = 'CREATED',
  CHANGED = 'CHANGED',
  REMOVED = 'REMOVED',
}

const MODULE_FIELDS: Record<string, Record<string, string>> = {
  [BLOCK_MODULES.OPPTY]: OPPTY_FIELDS,
  [BLOCK_MODULES.DEVELOPER]: DEVELOPER_FIELDS,
  [BLOCK_MODULES.PROJECT]: PROJECT_FIELDS,
  [BLOCK_MODULES.UNIT]: UNIT_FIELDS,
  [BLOCK_MODULES.UNIT_TYPE]: UNIT_TYPE_FIELDS,
};

const getModule = (contentType: string, field: string): string | null =>
  MODULE_FIELDS[contentType]?.[field] ?? null;

export const createActivity = async <T>({
  subdomain,
  oldDoc,
  newDoc,
  userId,
  contentId,
  module: contentType,
}: {
  subdomain: string;
  oldDoc?: T;
  newDoc: Partial<T>;
  userId: string;
  contentId: string;
  module: string;
}) => {
  const models = await generateModels(subdomain);

  const logActivity = async (
    action: Action,
    newValue: any,
    previousValue: any,
    module: string,
  ) => {
    const lastActivity = await models.BlockActivity.findOne({ contentId }).sort({
      createdAt: -1,
    });

    if (lastActivity?.module === module && lastActivity?.action === action) {
      const thirtyMinutesAgo = subMinutes(new Date(), 30);
      const isRecent = isAfter(
        new Date(lastActivity.createdAt),
        thirtyMinutesAgo,
      );

      if (
        isRecent &&
        toStr(newValue) === toStr(lastActivity.metadata.previousValue)
      ) {
        return models.BlockActivity.removeActivity(lastActivity._id);
      }

      return models.BlockActivity.updateActivity({
        _id: lastActivity._id,
        contentId,
        action,
        module,
        metadata: {
          newValue: toStr(newValue),
          previousValue: toStr(lastActivity.metadata.previousValue),
        },
        createdBy: userId,
      });
    }

    return models.BlockActivity.createActivity({
      contentId,
      action,
      module,
      metadata: {
        newValue: toStr(newValue),
        previousValue: toStr(previousValue),
      },
      createdBy: userId,
    });
  };

  for (const [field, newValue] of Object.entries(newDoc)) {
    const oldValue = oldDoc?.[field as keyof T];
    const module = getModule(contentType, field);

    if (!module) continue;

    let action: Action | null = null;

    if (['startDate', 'targetDate'].includes(field)) {
      if (!oldValue && newValue) action = Action.CREATED;
      else if (newValue !== oldValue)
        action = newValue ? Action.CHANGED : Action.REMOVED;
    } else if (newValue !== oldValue) {
      action = Action.CHANGED;
    }

    if (action) {
      await logActivity(action, newValue, oldValue, module);
    }
  }
};

export function toStr(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}
