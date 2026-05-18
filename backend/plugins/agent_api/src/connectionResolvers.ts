import { IIdentifierDocument } from '@/assistantOrg/@types/assistantOrg';
import { IAgentServerDocument } from '@/agent/@types/agent';
import { IOpencodeServerDocument } from '@/opencode/@types/opencode';
import { IMainContext } from 'erxes-api-shared/core-types';
import { createGenerateModels } from 'erxes-api-shared/utils';

import mongoose, { Model } from 'mongoose';

import { assistantOrgSchema } from './modules/assistantOrg/db/definitions/assistantOrg';
import { agentServerSchema } from './modules/agent/db/definitions/agent';
import { opencodeServerSchema } from './modules/opencode/db/definitions/opencode';

export interface IModels {
  Identifier: Model<IIdentifierDocument>;
  AgentServer: Model<IAgentServerDocument>;
  OpencodeServer: Model<IOpencodeServerDocument>;
}

export interface IContext extends IMainContext {
  models: IModels;
  subdomain: string;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  const identifierModel = db.model<IIdentifierDocument, Model<IIdentifierDocument>>(
    'assistant_orgs',
    assistantOrgSchema,
  );

  models.Identifier = identifierModel;

  models.AgentServer = db.model<
    IAgentServerDocument,
    Model<IAgentServerDocument>
  >('agent_serverss', agentServerSchema);

  models.OpencodeServer = db.model<
    IOpencodeServerDocument,
    Model<IOpencodeServerDocument>
  >('opencode_servers', opencodeServerSchema);

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
