import {
  IRegistrationApplication,
  RegistrationApplicationStatus,
} from '@/registration/@types/registrationApplication';
import { IRegistrationApplicationDocument } from '@/registration/@types/registrationApplicationDocument';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { registrationApplicationSchema } from '../definitions/registrationApplication';

export interface IRegistrationApplicationModel
  extends Model<IRegistrationApplicationDocument> {
  createApplication(
    doc: IRegistrationApplication,
  ): Promise<IRegistrationApplicationDocument>;
  updateApplicationById(
    _id: string,
    subdomain: string,
    patch: {
      answers?: Record<string, unknown>;
      status?: RegistrationApplicationStatus;
    },
  ): Promise<IRegistrationApplicationDocument | null>;
}

export const loadRegistrationApplicationClass = (models: IModels) => {
  class RegistrationApplication {
    public static async createApplication(
      doc: IRegistrationApplication,
    ) {
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
      },
    ) {
      const hasAnswers = patch.answers !== undefined;
      const hasStatus = patch.status !== undefined;
      if (!hasAnswers && !hasStatus) {
        throw new Error('Nothing to update');
      }

      const $set: Record<string, unknown> = { modifiedAt: new Date() };
      if (hasAnswers) {
        $set.answers = patch.answers;
      }
      if (hasStatus) {
        $set.status = patch.status;
      }

      return models.RegistrationApplication.findOneAndUpdate(
        { _id, subdomain },
        { $set },
        { new: true },
      );
    }
  }

  registrationApplicationSchema.loadClass(RegistrationApplication);

  return registrationApplicationSchema;
};
