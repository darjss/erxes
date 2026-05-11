import { Document } from 'mongoose';

export interface IAgentServer {
  identifierId?: string;
  name: string;
  url: string;
  token: string;
  approveCode: string;

  agentId: string;
  serverId: string;

  status: string;
}

export interface IAgentServerDocument extends IAgentServer, Document {
  _id: string;

  createdAt: Date;
  updatedAt: Date;
}
