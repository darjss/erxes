import { Document } from 'mongoose';

export interface IMastraAgent {
  name: string;
  agentId: string;
  description?: string;
  instructions?: string;
  provider: string;
  model: string;
  toolPolicy?: 'all' | 'custom';
  allowedTools?: string[];
  // Skill allowlist: glob patterns matched against global skills' name (or
  // `category/name`), e.g. ['erxes-*', 'sales/*']. The requesting user's own
  // published skills are always included on top. Empty/unset → no skills.
  skills?: string[];
  // Consent for irreversible deletes/merges. 'ask' (default) prompts the user;
  // 'allow' runs without asking. ('block' is a tolerated legacy value → 'ask'.)
  destructiveOps?: 'allow' | 'ask' | 'block';
  memoryEnabled?: boolean;
  maxSteps?: number;
  temperature?: number;
  isEnabled?: boolean;
  createdBy?: string;
  // Access control: who can see and chat with this agent.
  visibility?: 'private' | 'team' | 'department' | 'org';
  teamId?: string;       // set when visibility = 'team'  (branch _id)
  departmentId?: string; // set when visibility = 'department'
}

export interface IMastraAgentDocument
  extends IMastraAgent, Omit<Document, 'model'> {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
