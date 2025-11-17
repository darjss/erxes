import { Schema } from 'mongoose';

export const btkProjectMemberSchema = new Schema({
  memberId: { type: String, label: 'Member ID' },
  project: {
    type: Schema.Types.ObjectId,
    label: 'Project ID',
    ref: 'btk_projects',
  },
  role: { type: String, label: 'Role' },
});
