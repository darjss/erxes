import { Document } from 'mongoose';

export interface IBlockAgencyMember {
  agencyId?: string;
  memberId?: string;
  description?: string;
  country?: string;
  city?: string;
  district?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedUrl?: string;
  certificatePhotos?: string[];
  role?: 'admin' | 'lead' | 'member';
}

export interface IBlockAgencyAddMembersInput {
  agencyId: string;
  memberId: string;
}

export interface IBlockAgencyMemberDocument
  extends IBlockAgencyMember, Document<string> {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
