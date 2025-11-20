import { Document } from 'mongoose';
import { IBtk } from '~/types';

export interface IBtkAttachment extends IBtk {
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
