import { IBtk } from '~/types';

export interface INewsMember extends IBtk {
  memberId: string;
  news: string;
  role: string;
}

export interface INewsMemberDocument extends INewsMember, Document {
  _id: string;
}
