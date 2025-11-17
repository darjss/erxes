import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { IProjectDocument } from '@/project/@types/project';
import { IProjectPaymentPlan } from '@/project/@types/payment';
import mongoose from 'mongoose';

import { loadProjectClass, IProjectModel } from '@/project/db/models/Project';
import {
  loadProjectPaymentPlanClass,
  IProjectPaymentPlanModel,
} from '@/project/db/models/Payment';
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

import { loadProjectMemberClass } from '@/project/db/models/Member';
import { IProjectMemberDocument } from '@/project/@types/member';
import { IProjectMemberModel } from '@/project/db/models/Member';
import {
  IBtkActivityModel,
  loadBtkActivityClass,
} from '@/acitivity/db/models/Activity';
import { IBtkActivityDocument } from '@/acitivity/@types/acitivy';

export interface IModels {
  Project: IProjectModel;
  ProjectPaymentPlan: IProjectPaymentPlanModel;
  BtkDocument: IBtkDocumentModel;
  BtkAttachment: IBtkAttachmentModel;
  Company: ICompanyModel;
  ProjectMember: IProjectMemberModel;
  BtkActivity: IBtkActivityModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Project = db.model<IProjectDocument, IProjectModel>(
    'btk_projects',
    loadProjectClass(models),
  );

  models.ProjectPaymentPlan = db.model<
    IProjectPaymentPlan,
    IProjectPaymentPlanModel
  >('btk_project_payment_plans', loadProjectPaymentPlanClass(models));

  models.BtkDocument = db.model<IBtkDocumentDocument, IBtkDocumentModel>(
    'btk_documents',
    loadBtkDocumentClass(models),
  );

  models.BtkAttachment = db.model<IBtkAttachmentDocument, IBtkAttachmentModel>(
    'btk_attachments',
    loadBtkAttachmentClass(models),
  );

  models.Company = db.model<ICompanyDocument, ICompanyModel>(
    'btk_companys',
    loadCompanyClass(models),
  );

  models.ProjectMember = db.model<IProjectMemberDocument, IProjectMemberModel>(
    'btk_project_members',
    loadProjectMemberClass(models),
  );

  models.BtkActivity = db.model<IBtkActivityDocument, IBtkActivityModel>(
    'btk_activities',
    loadBtkActivityClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
