import { IBlock } from '~/types';

export interface IProjectMember extends IBlock {
  memberId: string;
  project: string;
  role: string;
}

export interface IProjectMemberDocument extends IProjectMember, Document {
  _id: string;
}
