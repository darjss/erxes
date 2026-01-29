import { OPPTY_FIELDS } from '@/oppty/constants';
import { isAfter, subMinutes } from 'date-fns';
import { difference, toString } from 'lodash';
import { generateModels } from '~/connectionResolvers';
import { validator } from './validator';

enum Action {
  CREATED = 'CREATED',
  CHANGED = 'CHANGED',
  REMOVED = 'REMOVED',
}

const MODULE_FIELDS: Record<string, Record<string, string>> = {
  oppty: OPPTY_FIELDS,
};

export const createActivity = async <T>({
  subdomain,

  oldDoc,
  newDoc,

  userId,
  contentId,
  module,
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
    field: string,
  ) => {
    const lastActivity = await models.BlockActivity.findOne({ contentId }).sort(
      {
        createdAt: -1,
      },
    );

    if (lastActivity?.field === field && lastActivity?.action === action) {
      const thirtyMinutesAgo = subMinutes(new Date(), 30);
      const isRecent = isAfter(
        new Date(lastActivity.createdAt),
        thirtyMinutesAgo,
      );

      if (
        isRecent &&
        toString(newValue) === toString(lastActivity.metadata.previousValue)
      ) {
        return models.BlockActivity.removeActivity(lastActivity._id);
      }

      return models.BlockActivity.updateActivity({
        _id: lastActivity._id,
        contentId,
        action,
        field,
        metadata: {
          newValue: toString(newValue),
          previousValue: toString(lastActivity.metadata.previousValue),
        },
        createdBy: userId,
      });
    }

    return models.BlockActivity.createActivity({
      contentId,
      action,
      field,
      metadata: {
        newValue: toString(newValue),
        previousValue: toString(previousValue),
      },
      createdBy: userId,
    });
  };

  for (const [field, newValue] of Object.entries(newDoc)) {
    const MODULE_FIELD = MODULE_FIELDS?.[module]?.[field];

    if (!MODULE_FIELD) continue;

    const oldValue = oldDoc?.[field];

    if (oldValue === newValue) continue;

    if (validator('array', oldValue, newValue)) {
      const added = difference(newValue, oldValue);
      const removed = difference(oldValue, newValue);

      if (added.length || removed.length) {
        await logActivity(
          Action.CHANGED,
          added.length ? added.join(',') : null,
          removed.length ? removed.join(',') : null,
          MODULE_FIELD,
        );
      }

      continue;
    }

    let action: Action | null = null;

    if ((oldValue && newValue) && (oldValue !== newValue)) {
      action = Action.CHANGED;
    }

    if (!oldValue && newValue) {
      action = Action.CREATED;
    }

    if (oldValue && !newValue) {
      action = Action.REMOVED;
    }

    if (action) {
      await logActivity(action, newValue, oldValue, MODULE_FIELD);
    }
  }
};
