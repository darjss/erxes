import { Document } from 'mongoose';
import { RegistrationFormDefinition } from '@/registration/@types/registrationForm';

export interface IRegistrationFormSchema extends RegistrationFormDefinition {
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface IRegistrationFormSchemaDocument
  extends Document, IRegistrationFormSchema {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}
