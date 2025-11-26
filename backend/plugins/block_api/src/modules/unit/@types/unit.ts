export interface IUnit {
  building: string;
  zoning: string;
  number: string;
  status: string;

  leads: string[];

  type: string;
}

export interface IUnitInput extends IUnit {
  useProjectPrice: boolean;
}

export interface IUnitDocument extends IUnit, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
