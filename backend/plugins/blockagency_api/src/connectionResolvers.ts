import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { IBlockAgencyDocument } from '~/modules/agency/@types/agency';
import { IBlockListingDocument } from './modules/listing/@types/listing';
import { IBlockAgencyMemberDocument } from './modules/member/@types/member';
import type { IBlockUnitAssignmentDocument, IBlockUnitAssignmentModel } from './modules/unit-assignment/db/unitAssignment';
import { blockUnitAssignmentSchema } from './modules/unit-assignment/db/unitAssignment';

import mongoose from 'mongoose';
import {
  IBlockAgencyModel,
  loadBlockAgencyClass,
} from '~/modules/agency/db/models/Agency';
import {
  IBlockListingModel,
  loadBlockListingClass,
} from './modules/listing/db/models/Listing';
import {
  IBlockAgencyMemberModel,
  loadBlockAgencyMemberClass,
} from './modules/member/db/models/Member';

export interface IModels {
  BlockAgency: IBlockAgencyModel;
  BlockListing: IBlockListingModel;
  BlockAgencyMember: IBlockAgencyMemberModel;
  BlockUnitAssignment: IBlockUnitAssignmentModel;
}

export interface IContext extends IMainContext {
  models: IModels;
  subdomain: string;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.BlockAgency = db.model<IBlockAgencyDocument, IBlockAgencyModel>(
    'block_agencies',
    loadBlockAgencyClass(models),
  );

  models.BlockListing = db.model<IBlockListingDocument, IBlockListingModel>(
    'block_listing',
    loadBlockListingClass(models),
  );

  models.BlockAgencyMember = db.model<IBlockAgencyMemberDocument, IBlockAgencyMemberModel>(
    'block_agencies_members',
    loadBlockAgencyMemberClass(models),
  );

  models.BlockUnitAssignment = db.model<
    IBlockUnitAssignmentDocument,
    IBlockUnitAssignmentModel
  >('block_agency_unit_assignments', blockUnitAssignmentSchema);

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
