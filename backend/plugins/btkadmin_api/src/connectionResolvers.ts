import { IBtkAttachmentDocument } from '@/attachment/@types/attachment';
import {
  IBtkAttachmentModel,
  loadBtkAttachmentClass,
} from '@/attachment/db/models/Attachment';

import { IBtkCompanyDocument } from '~/modules/company/db/@types/company';
import {
  IBtkCompanyModel,
  loadBtkCompanyClass,
} from '~/modules/company/db/models/Company';
import { IBtkDocumentDocument } from '@/document/@types/document';
import {
  IBtkDocumentModel,
  loadBtkDocumentClass,
} from '@/document/db/models/Document';

import { INewsMemberDocument } from '~/modules/news/@types/member';
import { INewsPaymentPlan } from '~/modules/news/@types/payment';
import { INewsDocument } from '~/modules/news/@types/news';
import {
  INewsMemberModel,
  loadNewsMemberClass,
} from '~/modules/news/db/models/Member';
import {
  INewsPaymentPlanModel,
  loadNewsPaymentPlanClass,
} from '~/modules/news/db/models/Payment';
import { INewsModel, loadNewsClass } from '~/modules/news/db/models/News';

import { IMainContext } from 'erxes-api-shared/core-types';
import mongoose from 'mongoose';
import { createGenerateModels } from './db';
import {
  ISubmissionDocument,
  ISubmissionModel,
  loadSubmissionClass,
} from './modules/form/db/models/Submission';

export interface IModels {
  News: INewsModel;
  NewsPaymentPlan: INewsPaymentPlanModel;
  BtkDocument: IBtkDocumentModel;
  BtkAttachment: IBtkAttachmentModel;
  Company: IBtkCompanyModel;
  NewsMember: INewsMemberModel;
  Submission: ISubmissionModel;
}

export interface IContext extends IMainContext {
  models: IModels;
  subdomain: string;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.News = db.model<INewsDocument, INewsModel>(
    'btk_admin_news',
    loadNewsClass(models),
  );

  models.NewsPaymentPlan = db.model<INewsPaymentPlan, INewsPaymentPlanModel>(
    'btk_admin_news_payment_plans',
    loadNewsPaymentPlanClass(models),
  );

  models.BtkDocument = db.model<IBtkDocumentDocument, IBtkDocumentModel>(
    'btk_admin_documents',
    loadBtkDocumentClass(models),
  );

  models.BtkAttachment = db.model<IBtkAttachmentDocument, IBtkAttachmentModel>(
    'btk_admin_attachments',
    loadBtkAttachmentClass(models),
  );

  models.Company = db.model<IBtkCompanyDocument, IBtkCompanyModel>(
    'btk_admin_companies',
    loadBtkCompanyClass(models),
  );

  models.NewsMember = db.model<INewsMemberDocument, INewsMemberModel>(
    'btk_admin_news_members',
    loadNewsMemberClass(models),
  );

  models.Submission = db.model<ISubmissionDocument, ISubmissionModel>(
    'btk_admin_submissions',
    loadSubmissionClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
