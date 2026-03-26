import { IMainContext } from 'erxes-api-shared/core-types';
import { createGenerateModels } from 'erxes-api-shared/utils';
import mongoose from 'mongoose';
import { MasterClient } from '~/utils/masterClient';
import { MtoMode } from '~/constants/mode';

// Provider
import { IProviderDocument } from '@/provider/@types/provider';
import {
  IProviderModel,
  loadProviderClass,
} from '@/provider/db/models/Provider';

// Config
import { ISystemConfigDocument } from '@/config/@types/config';
import {
  ISystemConfigModel,
  loadSystemConfigClass,
} from '@/config/db/models/Config';

// Banner
import { IBannerDocument } from '@/banner/@types/banner';
import { IBannerModel, loadBannerClass } from '@/banner/db/models/Banner';

// Registration
import { IRegistrationApplicationDocument } from '@/registration/@types/registrationApplicationDocument';
import {
  IRegistrationApplicationModel,
  loadRegistrationApplicationClass,
} from '@/registration/db/models/RegistrationApplication';

export interface IModels {
  Provider: IProviderModel;
  SystemConfig: ISystemConfigModel;
  Banner: IBannerModel;
  RegistrationApplication: IRegistrationApplicationModel;
}

export interface IContext extends IMainContext {
  models: IModels;
  subdomain: string;
  mode: MtoMode;
  instanceId?: string;
  masterClient?: MasterClient;
  masterUrl?: string;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Provider = db.model<IProviderDocument, IProviderModel>(
    'mto_providers',
    loadProviderClass(models),
  );

  models.SystemConfig = db.model<ISystemConfigDocument, ISystemConfigModel>(
    'mto_system_configs',
    loadSystemConfigClass(models),
  );

  models.Banner = db.model<IBannerDocument, IBannerModel>(
    'mto_banners',
    loadBannerClass(models),
  );

  models.RegistrationApplication = db.model<
    IRegistrationApplicationDocument,
    IRegistrationApplicationModel
  >(
    'mto_registration_applications',
    loadRegistrationApplicationClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
