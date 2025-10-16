import { Schema } from 'mongoose';

export const blockProjectMemberSchema = new Schema({
  memberId: { type: String, label: 'Member ID' },
  project: {
    type: Schema.Types.ObjectId,
    label: 'Project ID',
    ref: 'block_projects',
  },
  role: { type: String, label: 'Role' },
});
