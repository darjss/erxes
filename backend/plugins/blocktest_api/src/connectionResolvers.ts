import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { ICVClientDocument } from '@/client/@types/client';
import { ICVMarketDocument } from '@/market/@types/market';
import { ICVClientModel, loadCVClientClass } from '@/client/db/models/CVClient';
import { ICVMarketModel, loadCVMarketClass } from '@/market/db/models/CVMarket';
import {
  ICVRiskGroupModel,
  loadRiskGroupClass,
} from '@/risk/db/models/RiskGroup';
import mongoose from 'mongoose';
import { ICVRiskGroupDocument } from '@/risk/@types/riskGroup';

export interface IModels {
  CVClient: ICVClientModel;
  CVMarket: ICVMarketModel;
  CVRiskGroups: ICVRiskGroupModel;
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

  models.CVRiskGroups = db.model<ICVRiskGroupDocument, ICVRiskGroupModel>(
    'cv_risk_groups',
    loadRiskGroupClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
