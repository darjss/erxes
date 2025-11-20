import { Document } from 'mongoose';
import { IBtk } from '~/types';

export interface IBtkDocument extends IBtk {
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
