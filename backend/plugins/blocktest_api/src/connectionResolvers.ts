import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { ICVClientDocument } from '~/modules/client/@types/client';
import { ICVMarketDocument } from '~/modules/market/@types/market';
import { ICVClientModel, loadCVClientClass } from '@/client/db/models/CVClient';
import { ICVMarketModel, loadCVMarketClass } from '@/market/db/models/CVMarket';

import mongoose from 'mongoose';

export interface IModels {
  CVClient: ICVClientModel;
  CVMarket: ICVMarketModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.CVClient = db.model<ICVClientDocument, ICVClientModel>(
    'cv_client',
    loadCVClientClass(models),
  );

  models.CVMarket = db.model<ICVMarketDocument, ICVMarketModel>(
    'cv_market',
    loadCVMarketClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
