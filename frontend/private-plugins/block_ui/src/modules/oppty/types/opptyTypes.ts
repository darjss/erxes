export interface IOpptyFilter {
  number?: string;
  description?: string;
  customerId?: string;
  unitType?: string;
  unit?: string;
  assignedUserId?: string;
  status?: string;
  labelIds?: string[];
  tagIds?: string[];
  projectId?: string;
}

export interface IOpptyInput {
  number: string;
  description: string;
  customerId: string;
  unitTypes: string[];
  units: string[];
  assignedUserId: string;
  status: string;
  labelIds: string[];
  tagIds: string[];
  projectId: string;
  startDate: Date;
  targetDate: Date;
  customerSource: string;
}

export interface IOppty extends IOpptyInput {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
