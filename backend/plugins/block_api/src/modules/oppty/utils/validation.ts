import { DEFAULT_STATUS_TYPES } from '@/oppty/constants';
import { IOpptyDocument } from '../@types/oppty';
import { IModels } from '~/connectionResolvers';

type StatusKey =
  (typeof DEFAULT_STATUS_TYPES)[keyof typeof DEFAULT_STATUS_TYPES];

export type StatusValidationFunction = (
  status: string,
  oppty: IOpptyDocument,
  models: IModels,
) => Promise<void>;

export const STATUS_VALIDATION_FIELDS = {
  [DEFAULT_STATUS_TYPES.LEAD]: [
    'name',
    'assignedUserId',
    'customerId',
    'projectId',
  ],
};

export const STATUS_VALIDATION = {
  [DEFAULT_STATUS_TYPES.LEAD]: async (
    status: StatusKey,
    oppty: IOpptyDocument,
    models: IModels,
  ) => {
    const { type } = (await models.Status.findOne({ _id: status })) || {};

    if (!type) {
      throw new Error('The status has an invalid type');
    }

    // If the status is moving within the same type, no validation is needed
    if (status === type) return;

    // If moving to Lead type from another type, check if lead requirements are met
    if (status === DEFAULT_STATUS_TYPES.LEAD) {
      const VALIDATION_FIELDS =
        STATUS_VALIDATION_FIELDS[DEFAULT_STATUS_TYPES.LEAD];

      // Check if all required fields for Lead status are present in the oppty
      for (const field of VALIDATION_FIELDS) {
        // If any required field is missing, remove it from the validation list
        if (!oppty[field]) {
          const FIELD_INDEX = VALIDATION_FIELDS.findIndex((f) => f === field);

          VALIDATION_FIELDS.splice(FIELD_INDEX, 1);
        }
      }

      // if VALIDATION_FIELDS is not empty, it means there are missing required fields for Lead status, so throw an error with the list of missing fields
      if (VALIDATION_FIELDS.length) {
        throw new Error(
          'The oppty is missing required fields to move to Lead status: ' +
            VALIDATION_FIELDS.join(', '),
        );
      }
    }
  },
  [DEFAULT_STATUS_TYPES.QUALIFIED]: async (
    status: StatusKey,
    oppty: IOpptyDocument,
    models: IModels,
  ) => {
    const { status: opptyStatus } = oppty || {};

    const { type } = (await models.Status.findOne({ _id: status })) || {};

    if (!type) {
      throw new Error('The status has an invalid type');
    }
  },
};
