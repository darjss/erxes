export interface IUnit {
  zoning: string;
  number: string;
  status?: string;
  type: string;
  blockSubdomain?: string;
  blockEntityId?: string;
  agencySubdomain?: string;
  agencyEntityId?: string;
}

export interface IUnitInput extends IUnit {
  useProjectPrice: boolean;
}

export interface ITransferUnit {
  unitId: string;
  agencySubdomain: string;
  agencyId: string;
}

export interface IUnitDocument extends IUnit, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
