export interface IZoning {
  building: string;
  floor: number;
  usageTypes: string[];
  areaType: string;
  tenureTypes: string[];
  size: number;
}

export interface IZoningDocument extends IZoning, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
