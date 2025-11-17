export interface IBuilding {
  _id: string;
  name?: string;
  type?: string;
  description?: string;
  project: string;
  coverImage?: string;
}

export interface IZoning {
  _id: string;
  building: string;
  floor: number;
  usageType: string;
  tenureType: string;
  unitsCount: number;
  size: number;
}
