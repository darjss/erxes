export interface IBlockAgencyUnit {
  _id: string;
  blockUnitId: string;
  unitNumber?: string;
  agencyId: string;
  blockSubdomain: string;
  agencySubdomain: string;
  blockDeveloperName?: string;
  agency?: { name?: string };
  memberId?: string;
  assignedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
