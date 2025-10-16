import { Document } from 'mongoose';

export interface IBlockAttachment {
  itemType: string;
  itemId: string;
  order: number;
  attachment: string;
}

export interface IBlockAttachmentDocument extends Document, IBlockAttachment {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
