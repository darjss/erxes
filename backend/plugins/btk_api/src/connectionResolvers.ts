import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { INewsDocument } from '~/modules/news/@types/news';
import { INewsPaymentPlan } from '~/modules/news/@types/payment';
import mongoose from 'mongoose';

import { loadNewsClass, INewsModel } from '~/modules/news/db/models/News';
import {
  loadNewsPaymentPlanClass,
  INewsPaymentPlanModel,
} from '~/modules/news/db/models/Payment';
import { IBtkDocumentDocument } from '@/document/@types/document';

import {
  IBtkDocumentModel,
  loadBtkDocumentClass,
} from '@/document/db/models/Document';
import {
  IBtkAttachmentModel,
  loadBtkAttachmentClass,
} from '@/attachment/db/models/Attachment';
import { IBtkAttachmentDocument } from '@/attachment/@types/attachment';
import { ICompanyModel, loadCompanyClass } from '@/company/db/models/Company';
import { ICompanyDocument } from '@/company/db/@types/company';

import { loadNewsMemberClass } from '~/modules/news/db/models/Member';
import { INewsMemberDocument } from '~/modules/news/@types/member';
import { INewsMemberModel } from '~/modules/news/db/models/Member';
import {
  IBtkActivityModel,
  loadBtkActivityClass,
} from '@/acitivity/db/models/Activity';
import { IBtkActivityDocument } from '@/acitivity/@types/acitivy';

export interface IModels {
  News: INewsModel;
  NewsPaymentPlan: INewsPaymentPlanModel;
  BtkDocument: IBtkDocumentModel;
  BtkAttachment: IBtkAttachmentModel;
  Company: ICompanyModel;
  NewsMember: INewsMemberModel;
  BtkActivity: IBtkActivityModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.News = db.model<INewsDocument, INewsModel>(
    'btk_news',
    loadNewsClass(models),
  );

  models.NewsPaymentPlan = db.model<INewsPaymentPlan, INewsPaymentPlanModel>(
    'btk_news_payment_plans',
    loadNewsPaymentPlanClass(models),
  );

  models.BtkDocument = db.model<IBtkDocumentDocument, IBtkDocumentModel>(
    'btk_documents',
    loadBtkDocumentClass(models),
  );

  models.BtkAttachment = db.model<IBtkAttachmentDocument, IBtkAttachmentModel>(
    'btk_attachments',
    loadBtkAttachmentClass(models),
  );

  models.Company = db.model<ICompanyDocument, ICompanyModel>(
    'btk_companies',
    loadCompanyClass(models),
  );

  models.NewsMember = db.model<INewsMemberDocument, INewsMemberModel>(
    'btk_news_members',
    loadNewsMemberClass(models),
  );

  models.BtkActivity = db.model<IBtkActivityDocument, IBtkActivityModel>(
    'btk_activities',
    loadBtkActivityClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
