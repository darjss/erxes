import { Document } from 'mongoose';
import { IBlock } from '~/types';

export interface IBlockDocument extends IBlock {
  name: string;
  type: string;
  visibility: string;
  attachment: string;
  description: string;
  itemType: string;
  itemId: string;
}

export interface IBlockDocumentDocument extends IBlockDocument, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
