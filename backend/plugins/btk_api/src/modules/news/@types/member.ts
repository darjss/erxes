export interface INewsMember {
  memberId: string;
  news: string;
  role: string;
}

export interface INewsMemberDocument extends INewsMember, Document {
  _id: string;
}
