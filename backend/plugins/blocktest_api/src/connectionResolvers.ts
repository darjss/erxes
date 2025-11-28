import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { IBlocktestDocument } from '@/blocktest/@types/blocktest';

import mongoose from 'mongoose';

import { loadBlocktestClass, IBlocktestModel } from '@/blocktest/db/models/blocktest';

export interface IModels {
  Blocktest: IBlocktestModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Blocktest = db.model<IBlocktestDocument, IBlocktestModel>(
    'blocktest',
    loadBlocktestClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
