import { Document } from 'mongoose';

export interface IBtkAttachment {
  itemType: string;
  itemId: string;
  order: number;
  attachment: string;
}

export interface IBtkAttachmentDocument extends Document, IBtkAttachment {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
