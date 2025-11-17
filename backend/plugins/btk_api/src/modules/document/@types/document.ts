import { Document } from 'mongoose';

export interface IBtkDocument {
  name: string;
  type: string;
  visibility: string;
  attachment: string;
  description: string;
  itemType: string;
  itemId: string;
}

export interface IBtkDocumentDocument extends IBtkDocument, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
