import {
  IRegistrationFormSchema,
  IRegistrationFormSchemaDocument,
} from '@/registration/@types/registrationFormSchema';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { registrationFormSchema } from '../definitions/registrationFormSchema';

export interface IRegistrationFormSchemaModel extends Model<IRegistrationFormSchemaDocument> {
  createSchema(
    doc: IRegistrationFormSchema,
  ): Promise<IRegistrationFormSchemaDocument>;
  updateSchemaById(
    _id: string,
    patch: Partial<IRegistrationFormSchema>,
  ): Promise<IRegistrationFormSchemaDocument | null>;
  removeSchemaById(_id: string): Promise<{ deletedCount?: number }>;
}

export const loadRegistrationFormSchemaClass = (models: IModels) => {
  class RegistrationFormSchema {
    public static async createSchema(doc: IRegistrationFormSchema) {
      return models.RegistrationFormSchema.create({
        ...doc,
        createdAt: new Date(),
      });
    }

    public static async updateSchemaById(
      _id: string,
      patch: Partial<IRegistrationFormSchema>,
    ) {
      return models.RegistrationFormSchema.findOneAndUpdate(
        { _id },
        {
          $set: {
            ...patch,
            modifiedAt: new Date(),
          },
        },
        { new: true },
      );
    }

    public static async removeSchemaById(_id: string) {
      return models.RegistrationFormSchema.deleteOne({ _id });
    }
  }

  registrationFormSchema.loadClass(RegistrationFormSchema);

  return registrationFormSchema;
};
