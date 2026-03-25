import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { IBlockAgencyDocument } from '~/modules/agency/@types/agency';
import { IBlockListingDocument } from './modules/listing/@types/listing';

import mongoose from 'mongoose';
import {
  IBlockAgencyModel,
  loadBlockAgencyClass,
} from '~/modules/agency/db/models/Agency';
import {
  IBlockListingModel,
  loadBlockListingClass,
} from './modules/listing/db/models/Listing';

export interface IModels {
  BlockAgency: IBlockAgencyModel;
  BlockListing: IBlockListingModel;
}

export interface IContext extends IMainContext {
  models: IModels;
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

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
