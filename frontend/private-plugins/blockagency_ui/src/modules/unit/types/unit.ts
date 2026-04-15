export type BlockUnitStatus = 'available' | 'reserved' | 'sold' | 'leased';

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
  status?: BlockUnitStatus;
  assignedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUnitStatusCounts {
  available: number;
  reserved: number;
  sold: number;
  leased: number;
}
