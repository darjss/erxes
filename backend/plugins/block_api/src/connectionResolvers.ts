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
import { IBlockDocumentDocument } from '@/document/@types/document';
import {
  loadBuildingClass,
  IBuildingModel,
} from '@/building/db/models/Building';
import {
  IBlockDocumentModel,
  loadBlockDocumentClass,
} from '@/document/db/models/Document';
import {
  IBlockAttachmentModel,
  loadBlockAttachmentClass,
} from '@/attachment/db/models/Attachment';
import { IBlockAttachmentDocument } from '@/attachment/@types/attachment';
import {
  IBlockDeveloperModel,
  loadBlockDeveloperClass,
} from '@/developer/db/models/Developer';
import { IBlockDeveloperDocument } from '@/developer/db/@types/developer';
import { IContractModel } from '@/contract/db/models/Contract';
import { IContractDocument } from '@/contract/@types/contract';
import { loadContractClass } from '@/contract/db/models/Contract';
import { loadProjectMemberClass } from '@/project/db/models/Member';
import { IProjectMemberDocument } from '@/project/@types/member';
import { IProjectMemberModel } from '@/project/db/models/Member';
import {
  IBlockActivityModel,
  loadBlockActivityClass,
} from '@/acitivity/db/models/Activity';
import { IBlockActivityDocument } from '@/acitivity/@types/acitivy';
import { IUnitLeadModel, loadUnitLeadClass } from '@/unit/db/models/UnitLead';
import { IUnitLeadDocument } from '@/unit/@types/unitLead';
import { IOfferModel } from '@/contract/db/models/Offer';
import { IOfferDocument } from '@/contract/@types/offer';
import { loadOfferClass } from '@/contract/db/models/Offer';
import { IInvoiceModel } from '@/invoice/db/models/Invoice';
import { IInvoiceDocument } from '@/invoice/@types/invoice';
import { loadInvoiceClass } from '@/invoice/db/models/Invoice';
import { IUnitTypeDocument } from '@/unit/@types/unitType';
import { IUnitTypeModel, loadUnitTypeClass } from '@/unit/db/models/UnitType';
import { IOpptyModel, loadOpptyClass } from '@/oppty/db/models/Oppty';

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

export const loadClasses = (db: mongoose.Connection): IModels => {
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
    loadOpptyClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
