import { IBlockAttachmentDocument } from '@/attachment/@types/attachment';
import {
  IBlockAttachmentModel,
  loadBlockAttachmentClass,
} from '@/attachment/db/models/Attachment';
import { IBuildingDocument } from '@/building/@types/building';
import { IZoningDocument } from '@/building/@types/zoning';
import {
  IBuildingModel,
  loadBuildingClass,
} from '@/building/db/models/Building';
import { IZoningModel, loadZoningClass } from '@/building/db/models/Zoning';
import { IContractDocument } from '@/contract/@types/contract';
import { IOfferDocument } from '@/contract/@types/offer';
import {
  IContractModel,
  loadContractClass,
} from '@/contract/db/models/Contract';
import { IOfferModel, loadOfferClass } from '@/contract/db/models/Offer';
import { IBlockDeveloperDocument } from '@/developer/db/@types/developer';
import {
  IBlockDeveloperModel,
  loadBlockDeveloperClass,
} from '@/developer/db/models/Developer';
import { IBlockDocumentDocument } from '@/document/@types/document';
import {
  IBlockDocumentModel,
  loadBlockDocumentClass,
} from '@/document/db/models/Document';
import { IInvoiceDocument } from '@/invoice/@types/invoice';
import { IInvoiceModel, loadInvoiceClass } from '@/invoice/db/models/Invoice';
import { IOpptyModel, loadOpptyClass } from '@/oppty/db/models/Oppty';
import { IProjectMemberDocument } from '@/project/@types/member';
import { IProjectPaymentPlan } from '@/project/@types/payment';
import { IProjectDocument } from '@/project/@types/project';
import {
  IProjectMemberModel,
  loadProjectMemberClass,
} from '@/project/db/models/Member';
import {
  IProjectPaymentPlanModel,
  loadProjectPaymentPlanClass,
} from '@/project/db/models/Payment';
import { IProjectModel, loadProjectClass } from '@/project/db/models/Project';
import { IUnitDocument } from '@/unit/@types/unit';
import { IUnitLeadDocument } from '@/unit/@types/unitLead';
import { IUnitTypeDocument } from '@/unit/@types/unitType';
import { IUnitModel, loadUnitClass } from '@/unit/db/models/Unit';
import { IUnitLeadModel, loadUnitLeadClass } from '@/unit/db/models/UnitLead';
import { IUnitTypeModel, loadUnitTypeClass } from '@/unit/db/models/UnitType';
import { IMainContext } from 'erxes-api-shared/core-types';
import { createGenerateModels } from 'erxes-api-shared/utils';
import mongoose from 'mongoose';
import { IBlockActivityDocument } from '~/modules/activity/@types/acitivy';
import {
  IBlockActivityModel,
  loadBlockActivityClass,
} from '~/modules/activity/db/models/Activity';
import { IOpptyDocument } from './modules/oppty/@types/oppty';

export interface IModels {
  Project: IProjectModel;
  ProjectPaymentPlan: IProjectPaymentPlanModel;
  Building: IBuildingModel;
  Zoning: IZoningModel;
  Unit: IUnitModel;
  UnitType: IUnitTypeModel;
  UnitLead: IUnitLeadModel;
  BlockDocument: IBlockDocumentModel;
  BlockAttachment: IBlockAttachmentModel;
  Developer: IBlockDeveloperModel;
  Contract: IContractModel;
  ProjectMember: IProjectMemberModel;
  BlockActivity: IBlockActivityModel;
  Offer: IOfferModel;
  Invoice: IInvoiceModel;
  Oppty: IOpptyModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (
  db: mongoose.Connection,
  subdomain: string,
): IModels => {
  const models = {} as IModels;

  models.Project = db.model<IProjectDocument, IProjectModel>(
    'block_projects',
    loadProjectClass(models),
  );

  models.ProjectPaymentPlan = db.model<
    IProjectPaymentPlan,
    IProjectPaymentPlanModel
  >('block_project_payment_plans', loadProjectPaymentPlanClass(models));

  models.Building = db.model<IBuildingDocument, IBuildingModel>(
    'block_buildings',
    loadBuildingClass(models),
  );

  models.Zoning = db.model<IZoningDocument, IZoningModel>(
    'block_zonings',
    loadZoningClass(models),
  );

  models.Unit = db.model<IUnitDocument, IUnitModel>(
    'block_units',
    loadUnitClass(models),
  );

  models.UnitType = db.model<IUnitTypeDocument, IUnitTypeModel>(
    'block_unit_types',
    loadUnitTypeClass(models),
  );

  models.BlockDocument = db.model<IBlockDocumentDocument, IBlockDocumentModel>(
    'block_documents',
    loadBlockDocumentClass(models),
  );

  models.BlockAttachment = db.model<
    IBlockAttachmentDocument,
    IBlockAttachmentModel
  >('block_attachments', loadBlockAttachmentClass(models));

  models.Developer = db.model<IBlockDeveloperDocument, IBlockDeveloperModel>(
    'block_developers',
    loadBlockDeveloperClass(models),
  );

  models.Contract = db.model<IContractDocument, IContractModel>(
    'block_contracts',
    loadContractClass(models),
  );

  models.ProjectMember = db.model<IProjectMemberDocument, IProjectMemberModel>(
    'block_project_members',
    loadProjectMemberClass(models),
  );

  models.BlockActivity = db.model<IBlockActivityDocument, IBlockActivityModel>(
    'block_activities',
    loadBlockActivityClass(models),
  );

  models.UnitLead = db.model<IUnitLeadDocument, IUnitLeadModel>(
    'block_unit_leads',
    loadUnitLeadClass(models),
  );

  models.Offer = db.model<IOfferDocument, IOfferModel>(
    'block_offers',
    loadOfferClass(models),
  );

  models.Invoice = db.model<IInvoiceDocument, IInvoiceModel>(
    'block_invoices',
    loadInvoiceClass(models),
  );

  models.Oppty = db.model<IOpptyDocument, IOpptyModel>(
    'block_opptys',
    loadOpptyClass(models, subdomain),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
