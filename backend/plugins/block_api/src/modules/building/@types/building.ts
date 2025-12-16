export interface IBuilding {
  name: string;
  types: string[];
  description: string;
  project: string;
  usageType: string;
  coverImage: string;

  status: string;

  startDate: Date;
  endDate: Date;
}

export interface IBuildingDocument extends IBuilding, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
