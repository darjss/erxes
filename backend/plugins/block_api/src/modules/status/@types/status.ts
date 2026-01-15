export interface IStatus {
  name: string;
  projectId: string;
  description?: string;
  color?: string;
  type: string;
  order: number;
}

export interface IStatusDocument extends IStatus, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
