import { z } from 'zod';
import { addTicketSchema } from './validations';

export interface ITicket {
  _id: string;
  name: string;
  description: string;
  statusId: string;
  priority: number;
  labelIds: string[];
  tagIds: string[];
  assigneeId: string;
  userId: string;
  startDate: string;
  targetDate: string;
  createdAt: string;
  updatedAt: string;
  channelId: string;
  statusChangedDate: string;
  number: number;
  pipelineId: string;
  createdBy: string;
  isSubscribed?: boolean;
  propertiesData?: Record<string, any>;
  state?: string;
}

export type TAddTicket = z.infer<typeof addTicketSchema>;

export * from './ticketHotkeyScope';
export * from './validations';
