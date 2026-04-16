export interface IOpptyStatus {
  name: string;
  projectId: string;
  description?: string;
  color?: string;
  type: string;
  order?: number;
}

export interface IOpptyStatusDocument extends IOpptyStatus, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
