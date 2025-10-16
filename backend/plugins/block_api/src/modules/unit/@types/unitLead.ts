export interface IUnitLead {
  leadType: string;
  leadId: string;
  unit: string;
}

export interface IUnitLeadDocument extends IUnitLead, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
