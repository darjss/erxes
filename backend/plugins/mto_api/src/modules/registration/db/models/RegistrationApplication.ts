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
  }

  registrationApplicationSchema.loadClass(RegistrationApplication);

  return registrationApplicationSchema;
};
