import { Document } from 'mongoose';

export interface IBlockDocument {
  name: string;
  type: string;
  visibility: string;
  attachment?: string;
  description?: string;
  itemType: string;
  itemId: string;
  createdBy: string;
}

export interface IBlockDocumentDocument extends IBlockDocument, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
