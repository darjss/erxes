import {
  IRegistrationApplication,
  RegistrationApplicationStatus,
} from '@/registration/@types/registrationApplication';
import { IRegistrationApplicationDocument } from '@/registration/@types/registrationApplicationDocument';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { registrationApplicationSchema } from '../definitions/registrationApplication';

export interface IRegistrationApplicationModel extends Model<IRegistrationApplicationDocument> {
  createApplication(
    doc: IRegistrationApplication,
  ): Promise<IRegistrationApplicationDocument>;
  updateApplicationById(
    _id: string,
    subdomain: string,
    patch: {
      answers?: Record<string, unknown>;
      status?: RegistrationApplicationStatus;
      cpUserId?: string | null;
    },
  ): Promise<IRegistrationApplicationDocument | null>;
}

export const loadRegistrationApplicationClass = (models: IModels) => {
  class RegistrationApplication {
    public static async createApplication(doc: IRegistrationApplication) {
      return models.RegistrationApplication.create({
        ...doc,
        createdAt: new Date(),
      });
    }

    public static async updateApplicationById(
      _id: string,
      subdomain: string,
      patch: {
        answers?: Record<string, unknown>;
        status?: RegistrationApplicationStatus;
        cpUserId?: string | null;
      },
    ) {
      const hasAnswers = patch.answers !== undefined;
      const hasStatus = patch.status !== undefined;
      const hasCpUserId = patch.cpUserId !== undefined;
      if (!hasAnswers && !hasStatus && !hasCpUserId) {
        throw new Error('Nothing to update');
      }

      const $set: Record<string, unknown> = { modifiedAt: new Date() };
      const $unset: Record<string, 1> = {};
      if (hasAnswers) {
        $set.answers = patch.answers;
      }
      if (hasStatus) {
        $set.status = patch.status;
      }
      if (hasCpUserId) {
        if (patch.cpUserId === null) {
          $unset.cpUserId = 1;
        } else {
          $set.cpUserId = patch.cpUserId;
        }
      }

      const update: Record<string, unknown> = { $set };
      if (Object.keys($unset).length > 0) {
        update.$unset = $unset;
      }

      return models.RegistrationApplication.findOneAndUpdate(
        { _id, subdomain },
        update,
        { new: true },
      );
    }
  }

  registrationApplicationSchema.loadClass(RegistrationApplication);

  return registrationApplicationSchema;
};
