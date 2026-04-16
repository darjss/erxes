import { Document } from 'mongoose';
import { IRegistrationApplication } from './registrationApplication';

export interface IRegistrationApplicationDocument
  extends IRegistrationApplication, Document {
  _id: string;
}
