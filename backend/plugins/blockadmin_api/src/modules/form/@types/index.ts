import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';

export interface ISubmission {
  userId: string;
  form: number;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
}

export interface ILead {
  name: string;
  phone: string;
  email: string;
}

export interface ISubmissionDocument extends ISubmission, Document {
  submittedAt: Date;
}

export interface ISubmissionParams extends ICursorPaginateParams {
  formId?: number;
}
