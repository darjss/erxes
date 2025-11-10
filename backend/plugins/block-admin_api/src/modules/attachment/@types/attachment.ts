import { Document } from 'mongoose';
import { IBlock } from '~/types';

export interface IBlockAttachment extends IBlock {
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
