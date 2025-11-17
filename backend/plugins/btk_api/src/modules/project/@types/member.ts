export interface IProjectMember {
  memberId: string;
  project: string;
  role: string;
}

export interface IProjectMemberDocument extends IProjectMember, Document {
  _id: string;
}
