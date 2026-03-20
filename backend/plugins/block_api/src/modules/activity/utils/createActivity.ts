import { OPPTY_FIELDS } from '@/oppty/constants';
import { DEVELOPER_FIELDS } from '@/developer/constants';
import { PROJECT_FIELDS } from '@/project/constants';
import { UNIT_FIELDS, UNIT_TYPE_FIELDS } from '@/unit/constants';
import { isAfter, subMinutes } from 'date-fns';
import { difference, toString } from 'lodash';
import { generateModels } from '~/connectionResolvers';
import { validator } from './validator';
import { ObjectId } from "mongodb";

enum Action {
  CREATED = 'CREATED',
  CHANGED = 'CHANGED',
  REMOVED = 'REMOVED',
}

const serializeValue = (value: any): string => {
  if (validator('nil', value)) {
    return '';
  }
  
  if (validator('object', value) && !validator('array', value)) {
    if (Object.keys(value).length === 0) {
      return '';
    }
    return JSON.stringify(value);
  }
  
  if (validator('array', value)) {
    return value.map(item => {
      if (validator('object', item) && !validator('nil', item)) {
        return JSON.stringify(item);
      }
      return toString(item);
    }).join(',');
  }
  
  return toString(value);
};

const sameContent = (
  oldValue?: any,
  newValue?: any
): boolean => {
  
  if (validator('nil', oldValue) && validator('nil', newValue)) return true;
  if (validator('nil', oldValue) || validator('nil', newValue)) return false;
  
  if (validator('object', oldValue) && validator('object', newValue) && 
      !validator('array', oldValue) && !validator('array', newValue)) {
    return JSON.stringify(oldValue) === JSON.stringify(newValue);
  }
  
  if (validator('array', oldValue) && validator('array', newValue)) {
    return JSON.stringify(oldValue) === JSON.stringify(newValue);
  }
  
  if(ObjectId.isValid(oldValue as string) && ObjectId.isValid(newValue as string)) {
    return new ObjectId(oldValue as string).equals(new ObjectId(newValue as string));
  }



  return oldValue === newValue;
};

const MODULE_FIELDS: Record<string, Record<string, string>> = {
  oppty: OPPTY_FIELDS,
  developer: DEVELOPER_FIELDS,
  project: PROJECT_FIELDS,
  unit: UNIT_FIELDS,
  unit_type: UNIT_TYPE_FIELDS,
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
    dataType: string,
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
        sameContent(newValue, lastActivity.metadata.previousValue)
      ) {
        return models.BlockActivity.removeActivity(lastActivity._id);
      }

      return models.BlockActivity.updateActivity({
        _id: lastActivity._id,
        contentId,
        action,
        field,
        fieldType: dataType,
        metadata: {
          newValue: serializeValue(newValue),
          previousValue: serializeValue(lastActivity.metadata.previousValue),
        },
        createdBy: userId,
      });
    }

    return models.BlockActivity.createActivity({
      contentId,
      action,
      field,
      fieldType: dataType,
      metadata: {
        newValue: serializeValue(newValue),
        previousValue: serializeValue(previousValue),
      },
      createdBy: userId,
    });
  };


  for (const [field, newValue] of Object.entries(newDoc)) {
    const MODULE_FIELD = MODULE_FIELDS?.[module]?.[field];

    if (!MODULE_FIELD) continue;

    const oldValue = oldDoc?.[field];

    if (sameContent(oldValue, newValue as any)) continue;

    let dataType = '';

    if (validator('array', newValue)) {
      dataType = 'array';
    } else if (validator('object', newValue)){
      dataType = 'object';
    } else if (validator('string', newValue)) {
      dataType = 'string';
    } else if (validator('number', newValue)) {
      dataType = 'number';
    } else if (validator('boolean', newValue)) {
      dataType = 'boolean';
    } else {
      dataType = typeof newValue;
    }

    if (validator('array', oldValue, newValue)) {
      const added = difference(newValue, oldValue);
      const removed = difference(oldValue, newValue);

      if (added.length || removed.length) {
        await logActivity(
          Action.CHANGED,
          serializeValue(newValue),
          serializeValue(oldValue),
          MODULE_FIELD,
          dataType,
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
      const serializedNew = serializeValue(newValue);
      const serializedOld = serializeValue(oldValue);
      
      if (serializedNew === '' && serializedOld === '') {
        continue;
      }
      
      await logActivity(action, newValue, oldValue, MODULE_FIELD, dataType);
    }
  }
};
