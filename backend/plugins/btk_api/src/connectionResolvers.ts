import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { IProjectDocument } from '@/project/@types/project';
import { IProjectPaymentPlan } from '@/project/@types/payment';
import { IBuildingDocument } from '@/building/@types/building';
import mongoose from 'mongoose';
import { IZoningModel, loadZoningClass } from '@/building/db/models/Zoning';
import { IZoningDocument } from '@/building/@types/zoning';
import { IUnitDocument } from '@/unit/@types/unit';
import { loadProjectClass, IProjectModel } from '@/project/db/models/Project';
import {
  loadProjectPaymentPlanClass,
  IProjectPaymentPlanModel,
} from '@/project/db/models/Payment';
import { IUnitModel, loadUnitClass } from '@/unit/db/models/Unit';
import { IBtkDocumentDocument } from '@/document/@types/document';
import {
  loadBuildingClass,
  IBuildingModel,
} from '@/building/db/models/Building';
import {
  IBtkDocumentModel,
  loadBtkDocumentClass,
} from '@/document/db/models/Document';
import {
  IBtkAttachmentModel,
  loadBtkAttachmentClass,
} from '@/attachment/db/models/Attachment';
import { IBtkAttachmentDocument } from '@/attachment/@types/attachment';
import {
  IBtkDeveloperModel,
  loadBtkDeveloperClass,
} from '@/developer/db/models/Developer';
import { IBtkDeveloperDocument } from '@/developer/db/@types/developer';
import { IContractModel } from '@/contract/db/models/Contract';
import { IContractDocument } from '@/contract/@types/contract';
import { loadContractClass } from '@/contract/db/models/Contract';
import { loadProjectMemberClass } from '@/project/db/models/Member';
import { IProjectMemberDocument } from '@/project/@types/member';
import { IProjectMemberModel } from '@/project/db/models/Member';
import {
  IBtkActivityModel,
  loadBtkActivityClass,
} from '@/acitivity/db/models/Activity';
import { IBtkActivityDocument } from '@/acitivity/@types/acitivy';
import { IUnitLeadModel, loadUnitLeadClass } from '@/unit/db/models/UnitLead';
import { IUnitLeadDocument } from '@/unit/@types/unitLead';
import { IOfferModel } from '@/contract/db/models/Offer';
import { IOfferDocument } from '@/contract/@types/offer';
import { loadOfferClass } from '@/contract/db/models/Offer';
import { IInvoiceModel } from '@/invoice/db/models/Invoice';
import { IInvoiceDocument } from '@/invoice/@types/invoice';
import { loadInvoiceClass } from '@/invoice/db/models/Invoice';

export interface IModels {
  Project: IProjectModel;
  ProjectPaymentPlan: IProjectPaymentPlanModel;
  Building: IBuildingModel;
  Zoning: IZoningModel;
  Unit: IUnitModel;
  UnitLead: IUnitLeadModel;
  BtkDocument: IBtkDocumentModel;
  BtkAttachment: IBtkAttachmentModel;
  Developer: IBtkDeveloperModel;
  Contract: IContractModel;
  ProjectMember: IProjectMemberModel;
  BtkActivity: IBtkActivityModel;
  Offer: IOfferModel;
  Invoice: IInvoiceModel;
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

  models.Building = db.model<IBuildingDocument, IBuildingModel>(
    'btk_buildings',
    loadBuildingClass(models),
  );

  models.Zoning = db.model<IZoningDocument, IZoningModel>(
    'btk_zonings',
    loadZoningClass(models),
  );

  models.Unit = db.model<IUnitDocument, IUnitModel>(
    'btk_units',
    loadUnitClass(models),
  );

  models.BtkDocument = db.model<IBtkDocumentDocument, IBtkDocumentModel>(
    'btk_documents',
    loadBtkDocumentClass(models),
  );

  models.BtkAttachment = db.model<IBtkAttachmentDocument, IBtkAttachmentModel>(
    'btk_attachments',
    loadBtkAttachmentClass(models),
  );

  models.Developer = db.model<IBtkDeveloperDocument, IBtkDeveloperModel>(
    'btk_developers',
    loadBtkDeveloperClass(models),
  );

  models.Contract = db.model<IContractDocument, IContractModel>(
    'btk_contracts',
    loadContractClass(models),
  );

  models.ProjectMember = db.model<IProjectMemberDocument, IProjectMemberModel>(
    'btk_project_members',
    loadProjectMemberClass(models),
  );

  models.BtkActivity = db.model<IBtkActivityDocument, IBtkActivityModel>(
    'btk_activities',
    loadBtkActivityClass(models),
  );

  models.UnitLead = db.model<IUnitLeadDocument, IUnitLeadModel>(
    'btk_unit_leads',
    loadUnitLeadClass(models),
  );

  models.Offer = db.model<IOfferDocument, IOfferModel>(
    'btk_offers',
    loadOfferClass(models),
  );

  models.Invoice = db.model<IInvoiceDocument, IInvoiceModel>(
    'btk_invoices',
    loadInvoiceClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
