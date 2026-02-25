import { IAgentServerDocument } from '@/agent/@types/agent';
import { IMainContext } from 'erxes-api-shared/core-types';
import { createGenerateModels } from 'erxes-api-shared/utils';

import mongoose, { Model } from 'mongoose';

import { agentServerSchema } from './modules/agent/db/definitions/agent';

export interface IModels {
  AgentServer: Model<IAgentServerDocument>;
}

export interface IContext extends IMainContext {
  models: IModels;
  subdomain: string;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.AgentServer = db.model<
    IAgentServerDocument,
    Model<IAgentServerDocument>
  >('agent_servers', agentServerSchema);

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
